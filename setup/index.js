const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const is = require('fi-is');
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

  console.log(`\n${chalk.bold('AWS Profile: ')} ${process.env.AWS_PROFILE}\n`);

  // -----------------------------------------------------------------

  const cfm = new AWS.CloudFormation();
  const spinner = ora();

  try {
    const params = {
      StackName: `${package.name}-${process.env.NODE_ENV}-stack`,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      TemplateBody: null,
      Parameters: null
    };

    console.log(`\n${chalk.bold('Stack Name:  ')} ${params.StackName}\n`);

    spinner.text = 'Checking for current CloudFormation Stack...';
    spinner.start();

    const current = await new Promise(resolve => {
      const { StackName } = params;

      cfm.describeStacks({ StackName }, (err, data) => {
        if (err) {
          resolve();
          return;
        }

        spinner.warn('Template already exists.');

        resolve(data);
      });
    });

    spinner.stop();

    if (current) {
      const { confirm } = await inquirer.prompt({
        message: 'Proceed with stack update?',
        name: 'confirm',
        type: 'confirm',
        default: true
      });

      if (!confirm) {
        spinner.info('Update cancelled.');
        process.exit();
      }
    }

    const template = require('./template');
    const values = require('./values');

    const cfmParamPrompts = [];

    if (current) {
      const previous = chalk.reset.dim(' (empty for previous)');

      for (let value of values) {
        value.message += previous;
      }
    }

    for (let value of values) {
      cfmParamPrompts.push({
        ...value,
        message: `${value.message}:`,
        validate: val => (current && is.empty(val)) || value.validate(val)
      });
    }

    const cfmParamValues = await inquirer.prompt(cfmParamPrompts);

    params.TemplateBody = JSON.stringify(template);

    params.Parameters = Object.keys(cfmParamValues).map(ParameterKey => {
      const param = { ParameterKey };

      if (current && is.empty(cfmParamValues[ParameterKey])) {
        param.UsePreviousValue = true;
      } else {
        param.ParameterValue = cfmParamValues[ParameterKey];
      }

      return param;
    });

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

    const { StackId } = await new Promise((resolve, reject) => {
      if (current) {
        spinner.text = 'Updating CloudFormation Stack...';
        spinner.start();

        cfm.updateStack(params, (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          spinner.succeed('Stack updated!');

          resolve(data);
        });

        return;
      }

      spinner.text = 'Creating CloudFormation Stack...';
      spinner.start();

      params.EnableTerminationProtection = true;

      cfm.createStack(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed('Stack created!');

        resolve(data);
      });
    });

    spinner.info(StackId);
  } catch (err) {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  }
})();
