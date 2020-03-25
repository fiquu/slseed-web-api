import stageSelect from '@fiquu/slseed-web-utils/lib/stage-select';
import { prompt } from 'inquirer';
import dotenv from 'dotenv';
import chalk from 'chalk';
import AWS from 'aws-sdk';
import ora from 'ora';

const spinner = ora();

/**
 * @param {string} USERNAME The Cognito username.
 * @param {string} PASSWORD The user password.
 *
 * @returns {Promise<string>} A promise to the token.
 */
export async function getUserIdToken(USERNAME: string, PASSWORD: string): Promise<string> {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const { AuthenticationResult } = await cognito.adminInitiateAuth({
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME,
      PASSWORD
    }
  }).promise();

  return AuthenticationResult.IdToken;
}

/**
 * Lists available users.
 *
 * @returns {Promise<string>} A promise to the token.
 */
export async function listUsers(): Promise<string[]> {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const { Users } = await cognito.listUsers({
    UserPoolId: process.env.COGNITO_USER_POOL_ID
  }).promise();

  return Users.map(({ Attributes }) => {
    return Attributes.find(({ Name }) => Name === 'email').Value;
  });
}

(async (): Promise<void> => {
  await stageSelect();

  const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

  if (env.error) {
    throw env.error;
  }

  console.log(`${chalk.cyan.bold('Set User Password Script')}\n`);

  const users = await listUsers();
  const { USERNAME, PASSWORD } = await prompt([
    {
      name: 'USERNAME',
      type: 'list',
      message: 'Select user\'s email:',
      choices: users
    },
    {
      name: 'PASSWORD',
      type: 'password',
      message: 'Enter user\'s password:',
      default: 'av-clc-password',
      validate: (val: string): boolean => val && val.length > 10
    }
  ]);

  spinner.start('Getting Id token...');

  try {
    const idToken = await getUserIdToken(USERNAME, PASSWORD);

    spinner.info('Token generated:');

    console.log(JSON.stringify({
      Authorization: `Bearer ${idToken}`
    }, null, 2));
  } catch (err) {
    spinner.fail(err.message);
  }
})();

