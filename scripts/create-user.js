/**
 * Create User script.
 *
 * Creates a Cognito user and the user reference in the database.
 *
 * @example $ NODE_ENV=local node scripts/create-user.js
 */

const awsProfile = require('../utils/aws-profile');

awsProfile.update();

const validator = require('validator');
const inquirer = require('inquirer');
const mongoose = require('mongoose');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const package = require('../package.json');

/* Fetch SSM parameters */
(async () => {
  console.log(`\n${chalk.cyan.bold('Create User Script')}\n`);
  console.log(`${chalk.bold('Group:   ')} ${package.group.title}\n`);

  await require('../utils/stage-select')(true); // Set proper stage ENV

  const ssmr = require('../utils/ssm-params-resolve');

  AWS.config.update({
    region: 'us-east-1',
    apiVersions: {
      cognitoidentityserviceprovider: '2016-04-18',
      ssm: '2014-11-06'
    }
  });

  const cognito = new AWS.CognitoIdentityServiceProvider();
  const spinner = ora();

  try {
    spinner.text = 'Resolving SSM parameters...';

    spinner.start();

    await ssmr(['db-uri', 'cognito-user-pool-id'], true);

    spinner.succeed('SSM parameters resolved.');

    spinner.text = 'Connecting to the database...';

    spinner.start();

    const Database = require('../service/components/database');

    const database = new Database();

    await database.connect();

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

    const answers = await inquirer.prompt(questions);

    spinner.text = 'Creating Cognito user...';

    spinner.start();

    params = {
      ...answers,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        ...UserAttributes,
        {
          Name: 'name',
          Value: 'slseed'
        }
      ]
    };

    const data = await new Promise((resolve, reject) =>
      cognito.adminCreateUser(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`Cognito user created: ${chalk.bold(data.User.Username)}`);

        resolve(data);
      })
    );

    spinner.text = 'Inserting user reference in the database...';

    spinner.start();

    const userSchema = require('../service/schemas/user');
    const User = mongoose.model('user', userSchema);

    const user = await User.create({
      sub: data.User.Username
    });

    if (!user) {
      throw new Error('User reference not created!');
    }

    spinner.succeed(`User reference created: ${chalk.bold(user._id.toString())}`);

    process.exit(0);
  } catch (err) {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  }
})();
