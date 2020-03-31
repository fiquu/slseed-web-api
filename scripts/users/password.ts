import stageSelect from '@fiquu/slseed-web-utils/lib/stage-select';
import { prompt } from 'inquirer';
import dotenv from 'dotenv';
import chalk from 'chalk';
import AWS from 'aws-sdk';
import ora from 'ora';

const spinner = ora();

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

console.log(`${chalk.cyan.bold('Set User Password Script')}\n`);

(async (): Promise<void> => {
  await stageSelect();

  const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

  if (env.error) {
    throw env.error;
  }

  const users = await listUsers();

  const { Username, Permanent, Password } = await prompt([
    {
      name: 'Username',
      type: 'list',
      message: 'Select user\'s email:',
      choices: users
    },
    {
      name: 'Password',
      type: 'password',
      message: 'Enter user\'s password:',
      validate: (val: string): boolean => val && val.length > 10
    },
    {
      name: 'Permanent',
      type: 'confirm',
      message: 'Permanent?',
      default: true
    }
  ]);

  spinner.start('Updating password...');

  const cognito = new AWS.CognitoIdentityServiceProvider();

  await cognito.adminSetUserPassword({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Permanent,
    Username,
    Password
  }).promise();

  spinner.succeed('Password updated!');
})();
