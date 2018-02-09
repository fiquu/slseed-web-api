/**
 * Create User script.
 *
 * Creates a Cognito user and the user reference in the database.
 *
 * @example $ NODE_ENV=local node scripts/create-user.js
 */

const profiles = require('../configs/profiles');

process.env.AWS_PROFILE = profiles[process.env.NODE_ENV] || 'default';

const validator = require('validator');
const mongoose = require('mongoose');
const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const package = require('../package.json');

mongoose.Promise = Promise;

AWS.config.update({
  region: 'us-east-1',
  apiVersions: {
    cognitoidentityserviceprovider: '2016-04-18',
    ssm: '2014-11-06'
  }
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const ssm = new AWS.SSM();
const spinner = ora();

console.log(`\n${chalk.cyan.bold('Create User Script')}\n`);
console.log(`${chalk.bold('Profile: ')} ${process.env.AWS_PROFILE}`);
console.log(`${chalk.bold('Group:   ')} ${package.group.title}\n`);

/* Fetch SSM parameters */
new Promise((resolve, reject) => {
  spinner.text = 'Resolving SSM parameters...';

  spinner.start();

  const mappings = {
    [`/${package.group.name}/${process.env.NODE_ENV}/cognito-user-pool-id`]: 'COGNITO_USER_POOL_ID',
    [`/${package.group.name}/${process.env.NODE_ENV}/db-uri`]: 'DB_URI'
  };

  const params = {
    Names: Object.keys(mappings),
    WithDecryption: true
  };

  ssm.getParameters(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    /* Map SSM parameters to env vars */
    data.Parameters.forEach(param => {
      if (mappings[param.Name]) {
        spinner.info(
          `SSM: ${chalk.bold(param.Name)} --> ${chalk.bold(mappings[param.Name])} = ${chalk.bold(param.Value)}`
        );
        process.env[mappings[param.Name]] = param.Value;
      }
    });

    spinner.succeed('SSM parameters resolved.');

    resolve();
  });
})

  .then(() => {
    spinner.text = 'Connecting to the database...';

    spinner.start();

    const dbConfig = require('../service/configs/database');

    mongoose.connect(process.env.DB_URI, dbConfig.options);
  })

  .then(() => {
    spinner.succeed('Successfully connected to the database.');

    const UserAttributes = [];

    const questions = [
      {
        name: 'Username',
        type: 'input',
        message: 'User email:',
        validate: val => val && validator.isEmail(val),
        filter: val => {
          if (val) {
            UserAttributes.push({
              Name: 'email',
              Value: val
            });
          }

          return val;
        }
      },
      {
        name: 'ForceAliasCreation',
        type: 'confirm',
        message: 'Force alias creation?',
        default: false
      },
      {
        name: 'TemporaryPassword',
        type: 'input',
        message: `Temporary password ${chalk.reset.gray('(empty for auto):')}`,
        validate: val => (val ? val.length > 8 : true),
        filter: val => val || null
      },
      {
        name: 'MessageAction',
        type: 'list',
        message: 'Select message action:',
        choices: ['None', 'Resend', 'Supress'],
        filter: val => {
          switch (val) {
            case 'Resend':
              return 'RESEND';

            case 'Supress':
              return 'SUPRESS';

            default:
              return null;
          }
        }
      },
      {
        name: 'UserAttributes',
        type: 'confim',
        message: 'Confirm email?',
        default: true,
        filter: val => {
          if (val) {
            UserAttributes.push({
              Name: 'email_verified',
              Value: 'True'
            });
          }

          return val;
        }
      }
    ];

    return inquirer.prompt(questions).then(answers => {
      answers.UserAttributes = UserAttributes;
      return answers;
    });
  })

  .then(answers => {
    spinner.text = 'Creating Cognito user...';

    spinner.start();

    const params = Object.assign(answers, {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      DesiredDeliveryMediums: ['EMAIL']
    });

    return new Promise((resolve, reject) =>
      cognito.adminCreateUser(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`Cognito user created: ${chalk.bold(data.User.Username)}`);

        resolve(data);
      })
    );
  })

  .then(data => {
    spinner.text = 'Inserting user reference in the database...';

    spinner.start();

    const userSchema = require('../service/schemas/user');
    const User = mongoose.model('user', userSchema);

    return User.create({
      sub: data.User.Username
    });
  })

  .then(user => {
    if (!user) {
      throw new Error('User reference not created!');
    }

    spinner.succeed(`User reference created: ${chalk.bold(user._id.toString())}`);

    return null;
  })

  .then(() => process.exit(0))

  .catch(err => {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  });
