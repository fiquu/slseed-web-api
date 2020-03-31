import { AdminCreateUserRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import stageSelect from '@fiquu/slseed-web-utils/lib/stage-select';
import { PromiseResult } from 'aws-sdk/lib/request';
import inquirer from 'inquirer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import is from '@fiquu/is';
import chalk from 'chalk';
import AWS from 'aws-sdk';
import ora from 'ora';

const spinner = ora();

type CreateResult = Promise<PromiseResult<AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse, AWS.AWSError>>;

/**
 * Creates a user in the Cognito user pool.
 *
 * @param {object} answers The input answers.
 * @param {Array} UserAttributes The processed user attributes.
 *
 * @returns {Promise} A promise to the user creation.
 */
function createCognitoUser(answers: any, UserAttributes: any[]): CreateResult {
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const params: AdminCreateUserRequest = {
    Username: answers.Username,
    ForceAliasCreation: answers.ForceAliasCreation,
    TemporaryPassword: answers.TemporaryPassword,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    MessageAction: answers.MessageAction,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      ...UserAttributes,
      {
        Name: 'email_verified',
        Value: 'True'
      }
    ]
  };

  return cognito.adminCreateUser(params).promise();
}

(async (): Promise<void> => {
  await stageSelect();

  const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

  if (env.error) {
    throw env.error;
  }

  console.log(`${chalk.cyan.bold('Create User Script')}\n`);

  try {
    spinner.start('Connecting to the database...');

    const db = (await import('../../service/components/database')).default; // ?;
    const conn = await db.connect('default');

    const User = conn.model('user');

    spinner.succeed('Successfully connected to the database.');

    const UserAttributes = [];
    const answers = await inquirer.prompt([
      {
        name: 'Username',
        type: 'input',
        message: 'Enter user\'s email:',
        validate: (val: string): boolean => val && is.email(val),
        filter: (val: string): string => {
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
        name: 'name',
        type: 'input',
        message: 'Enter user\'s name:',
        validate: (val: string): boolean => val && val.length > 1
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
        validate: (val: string): boolean => (val ? val.length > 8 : true),
        filter: (val: string): string => val || null
      },
      {
        name: 'MessageAction',
        type: 'list',
        message: 'Select message action:',
        default: 'None',
        choices: [{
          name: 'None',
          value: null
        }, {
          name: 'Resend',
          value: 'RESEND'
        }, {
          name: 'Supress',
          value: 'SUPRESS'
        }]
      }
    ]);

    spinner.start('Creating Cognito user...');

    const { User: CognitoUser } = await createCognitoUser(answers, UserAttributes);

    spinner.succeed(`Cognito user created: ${chalk.bold(CognitoUser.Username)}`);
    spinner.info('Creating user in the database...');

    const user = await User.create({
      sub: CognitoUser.Username,
      name: answers.name
    });

    if (!user) {
      throw new Error('User not created!');
    }

    spinner.succeed(`User created: ${chalk.bold(user._id.toString())}`);
  } catch (err) {
    spinner.fail(err.message);
    console.error(err);
  }

  await mongoose.disconnect();
})();
