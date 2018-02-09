/**
 * Cognito user pool create script.
 *
 * Creates a user pool, creates the identity pool, assigns the user pool to the identity pool and creates the
 * corresponding SSM parameters.
 *
 * @example $ NODE_ENV=local node scripts/cognito-user-pool-create.js
 */

const profiles = require('../configs/profiles');

process.env.AWS_PROFILE = profiles[process.env.NODE_ENV] || 'default';

const inquirer = require('inquirer');
const titleize = require('titleize');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const slug = require('slug');
const ora = require('ora');

const package = require('../package.json');

AWS.config.update({
  region: 'us-east-1',
  apiVersions: {
    cognitoidentityserviceprovider: '2016-04-18',
    cognitoidentity: '2014-06-30',
    ssm: '2014-11-06'
  }
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const identity = new AWS.CognitoIdentity();
const ssm = new AWS.SSM();
const spinner = ora();

const s = val =>
  slug(val, {
    lower: true
  });

const n = val => (val ? s(val) + '-' : '');

const t = val => (val ? val + ' ' : '');

const questions = [
  {
    name: 'name',
    type: 'input',
    message: `Instance name ${chalk.reset.gray('(blank for none)')}`
  }
];

inquirer
  .prompt(questions)

  /* Create the user pool */
  .then(answers => {
    spinner.text = 'Creating User Pool...';

    spinner.start();

    const params = {
      PoolName: `${s(package.group.name)}-${n(answers.name)}${s(process.env.NODE_ENV)}`,
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true
      },
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email'],
      MfaConfiguration: 'OFF',
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireSymbols: false,
          RequireUppercase: false
        }
      },
      Schema: [
        {
          AttributeDataType: 'String',
          Name: 'email',
          Required: true
        },
        {
          AttributeDataType: 'String',
          Name: 'name',
          Required: true
        }
      ],
      VerificationMessageTemplate: {
        DefaultEmailOption: 'CONFIRM_WITH_CODE'
      }
    };

    return new Promise((resolve, reject) =>
      cognito.createUserPool(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`User Pool created: ${chalk.bold(data.UserPool.Id)}`);

        resolve([answers, data.UserPool]);
      })
    );
  })

  /* Create the User Pool Client */
  .then(([answers, UserPool]) => {
    spinner.text = 'Creating User Pool Client...';

    spinner.start();

    const params = {
      ClientName: `${s(package.group.name)}-${n(answers.name)}app-${process.env.NODE_ENV}`,
      ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
      UserPoolId: UserPool.Id,
      GenerateSecret: false
    };

    return new Promise((resolve, reject) =>
      cognito.createUserPoolClient(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`User Pool Client created: ${chalk.bold(data.UserPoolClient.ClientId)}`);

        resolve([answers, UserPool, data.UserPoolClient]);
      })
    );
  })

  /* Create the User Pool Id SSM parameter */
  .then(([answers, UserPool, UserPoolClient]) => {
    spinner.text = 'Creating User Pool Id SSM parameter...';

    spinner.start();

    const params = {
      Name: `/${s(package.group.name)}/${s(process.env.NODE_ENV)}/${n(answers.name)}cognito-user-pool-id`,
      Value: UserPool.Id,
      Overwrite: true,
      Type: 'String',
      Description: titleize(`${package.group.title} ${process.env.NODE_ENV} ${t(answers.name)}Cognito User Pool Id`)
    };

    return new Promise((resolve, reject) =>
      ssm.putParameter(params, err => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`Cognito User Pool Id SSM parameter created: ${chalk.bold(params.Name)}`);

        resolve([answers, UserPool, UserPoolClient]);
      })
    );
  })

  .then(([answers, UserPool, UserPoolClient]) => {
    spinner.text = 'Creating App Client Id SSM parameter...';

    spinner.start();

    /* Create the App Client Id SSM parameter */
    const params = {
      Name: `/${s(package.group.name)}/${s(process.env.NODE_ENV)}/${n(answers.name)}cognito-app-client-id`,
      Value: UserPoolClient.ClientId,
      Overwrite: true,
      Type: 'String',
      Description: titleize(`${package.group.title} ${process.env.NODE_ENV} ${t(answers.name)}Cognito App Client Id`)
    };

    return new Promise((resolve, reject) =>
      ssm.putParameter(params, err => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`Cognito App Client Id SSM parameter created: ${chalk.bold(params.Name)}`);

        resolve([answers.name, UserPool, UserPoolClient]);
      })
    );
  })

  .then(([name, UserPool, UserPoolClient]) => {
    const questions = [
      {
        name: 'create',
        type: 'confirm',
        message: `Create and associate an Identity Pool?`,
        default: true
      }
    ];

    return inquirer.prompt(questions).then(answers => [answers, name, UserPool, UserPoolClient]);
  })

  .then(([answers, name, UserPool, UserPoolClient]) => {
    if (!answers.create) {
      return null;
    }

    spinner.text = 'Creating Cognito Identity Pool...';

    spinner.start();

    /* Create the Identity Pool */
    const params = {
      AllowUnauthenticatedIdentities: false,
      IdentityPoolName: titleize(`${package.group.title} ${process.env.NODE_ENV}${t(name)}`),
      CognitoIdentityProviders: [
        {
          ProviderName: `cognito-idp.${AWS.config.region}.amazonaws.com/${UserPool.Id}`,
          ClientId: UserPoolClient.ClientId
        }
      ]
    };

    return new Promise((resolve, reject) =>
      identity.createIdentityPool(params, (err, data) => {
        if (err) {
          reject(err, err.stack);
          return;
        }

        spinner.succeed(`Cognito Identity Pool created: ${chalk.bold(data.IdentityPoolId)}`);

        resolve([data.IdentityPoolId, name]);
      })
    );
  })

  .then(([IdentityPoolId, name]) => {
    if (!IdentityPoolId) {
      return null;
    }

    spinner.text = 'Creating Identity Pool Id SSM parameter...';

    spinner.start();

    /* Create the Identity Pool Id SSM parameter */
    const params = {
      Name: `/${s(package.group.name)}/${s(process.env.NODE_ENV)}/${n(name)}cognito-identity-pool-id`,
      Value: IdentityPoolId,
      Overwrite: true,
      Type: 'String',
      Description: titleize(
        `${package.group.title} ${process.env.NODE_ENV} ${t(name)}Cognito Identity Pool Id`
      )
    };

    return new Promise((resolve, reject) =>
      ssm.putParameter(params, err => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed(`Cognito Identity Pool Id SSM parameter created: ${chalk.bold(params.Name)}`);

        resolve();
      })
    );
  })

  .then(() => {
    spinner.succeed('All done!');
    process.exit(0);
  })

  .catch(err => {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  });
