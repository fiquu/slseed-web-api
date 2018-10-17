/**
 * Setup script.
 *
 * Sets the instance environment up.
 *
 * @example $ node setup
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const package = require('../package.json');

(async () => {
  console.log(`\n${chalk.cyan.bold('Application Setup Script')}\n`);
  console.log(`${chalk.bold('Group Title: ')} ${package.group.title}`);
  console.log(`${chalk.bold('Group Name:  ')} ${package.group.name}\n`);

  // Set proper stage ENV
  await require('../utils/stage-select')(true);

  // Set AWS config
  AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE
    })
  });

  // Initialize params
  const params = {
    StackName: `${package.name}-${process.env.NODE_ENV}-stack`
  };

  console.log(`\n${chalk.bold('AWS Profile: ')} ${process.env.AWS_PROFILE}`);
  console.log(`${chalk.bold('Stack Name:  ')} ${params.StackName}\n`);

  // -----------------------------------------------------------------

  const cfm = new AWS.CloudFormation();
  const spinner = ora();

  const template = require('./template');
  const values = require('./values');

  try {
    spinner.stop();

    const answers = await inquirer.prompt(values);

    params.TemplateBody = JSON.stringify(template(answers));

    spinner.text = 'Validating CloudFormation Stack Template...';
    spinner.start();

    await new Promise((resolve, reject) => {
      const { TemplateBody } = params;

      cfm.validateTemplate({ TemplateBody }, err => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed('Template is valid.');

        resolve();
      });
    });

    spinner.text = 'Creating CloudFormation Stack...';
    spinner.start();

    const { StackId } = await new Promise((resolve, reject) => {
      params.EnableTerminationProtection = true;

      cfm.createStack(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });

    spinner.succeed('Stack created!');

    spinner.info(StackId);
  } catch (err) {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  }
})();
