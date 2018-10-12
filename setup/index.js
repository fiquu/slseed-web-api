/**
 * Cognito user pool create script.
 *
 * Creates a user pool, creates the identity pool, assigns the user pool to the identity pool and creates the
 * corresponding SSM parameters.
 *
 * @example $ NODE_ENV=local node scripts/cognito-user-pool-create.js
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const package = require('../package.json');
const template = require('./template');
const values = require('./values');

(async () => {
  console.log(`\n${chalk.cyan.bold('AWS CloudFormation Main Stack Script')}`);
  console.log(`${chalk.bold('Group Title: ')} ${package.group.title}`);
  console.log(`${chalk.bold('Group Name:  ')} ${package.group.name}\n`);

  await require('../utils/stage-select')(true); // Set proper stage ENV

  console.log(`\n${chalk.bold('AWS Profile: ')} ${process.env.AWS_PROFILE}\n`);

  AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE
    })
  });

  const cfm = new AWS.CloudFormation();
  const spinner = ora();

  try {
    const answers = await inquirer.prompt(values());

    const params = {
      StackName: `${package.name}-${process.env.NODE_ENV}-stack`,
      EnableTerminationProtection: true,
      TemplateBody: JSON.stringify(template(answers))
    };

    spinner.text = 'Validating CloudFormation Stack...';
    spinner.start();

    await new Promise((resolve, reject) => {
      const { TemplateBody } = params;

      cfm.validateTemplate({ TemplateBody }, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });

    spinner.text = 'Creating CloudFormation Stack...';
    spinner.start();

    const { StackId } = await new Promise((resolve, reject) => {
      cfm.createStack(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });

    spinner.succeed('Stack created');

    spinner.info(StackId);

    process.exit(0);
  } catch (err) {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  }
})();
