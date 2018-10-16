/**
 * Cognito user pool create script.
 *
 * Creates a user pool, creates the identity pool, assigns the user pool to the identity pool and creates the
 * corresponding SSM parameters.
 *
 * @example $ NODE_ENV=local node scripts/cognito-user-pool-create.js
 */

const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const package = require('../package.json');

module.exports = async () => {
  const params = {
    StackName: `${package.name}-${process.env.NODE_ENV}-stack`
  };

  console.log(`\n${chalk.cyan.bold('CloudFormation Stack Setup')}\n`);
  console.log(`${chalk.bold('Stack Name:  ')} ${params.StackName}\n`);

  const cfm = new AWS.CloudFormation();
  const spinner = ora();

  const template = require('./template');

  try {
    spinner.stop();

    params.TemplateBody = JSON.stringify(template);

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
};
