const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const is = require('fi-is');
const ora = require('ora');

const { group, name } = require('../../package.json');

(async () => {
  console.log(`\n${chalk.cyan.bold('Application Setup Script')}\n`);
  console.log(`${chalk.bold('Group Title:')} ${group.title}`);
  console.log(`${chalk.bold('Group Name:')}  ${group.name}\n`);

  // Set proper stage ENV
  await require('../../utils/stage-select')(true);

  const { AWS_PROFILE, NODE_ENV } = process.env;

  // Set AWS config
  AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.SharedIniFileCredentials({
      profile: AWS_PROFILE
    })
  });

  console.log(`\n${chalk.bold('AWS Profile:')} ${AWS_PROFILE}`);

  // -----------------------------------------------------------------

  const cfm = new AWS.CloudFormation();
  const spinner = ora();

  try {
    const nameSlug = `${group.name}-${name}`.replace(/\W+/g, '-').replace(/-+/g, '-').trim();
    const StackName = `${nameSlug}-${NODE_ENV}-base-stack`;

    console.log(`${chalk.bold('Stack Name:')}  ${StackName}\n`);

    spinner.start('Checking for current CloudFormation Stack...');

    const current = await new Promise(resolve => {
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

      for (const value of values) {
        value.message += previous;
        value.default = undefined;
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

    const { confirm } = await inquirer.prompt({
      message: 'Confirm values?',
      name: 'confirm',
      type: 'confirm',
      default: true
    });

    if (!confirm) {
      spinner.warn('Values not confirmed. Cancelled.');
      process.exit();
    }

    // Add values as template params
    for (const param of Object.keys(cfmParamValues)) {
      template.Parameters[param] = {
        Description: cfmParamValues.message,
        Type: 'String'
      };
    }

    const params = {
      StackName,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      TemplateBody: JSON.stringify(template),
      Parameters: Object.keys(cfmParamValues).map(ParameterKey => {
        const param = { ParameterKey };

        if (current && is.empty(cfmParamValues[ParameterKey])) {
          param.UsePreviousValue = true;
        } else {
          param.ParameterValue = cfmParamValues[ParameterKey];
        }

        return param;
      })
    };

    spinner.start('Validating CloudFormation Stack Template...');

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
        spinner.start('Updating CloudFormation Stack...');

        cfm.updateStack(params, (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          spinner.succeed('Stack update initiated.');

          resolve(data);
        });

        return;
      }

      spinner.start('Creating CloudFormation Stack...');

      params.EnableTerminationProtection = true;

      cfm.createStack(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        spinner.succeed('Stack creation initiated.');

        resolve(data);
      });
    });

    spinner.info(`Stack Id: ${StackId}`);

    spinner.info('You can skip the check process if you wish by pressing [CTRL+C].');
    spinner.start('Checking CloudFormation Stack status (this may take several minutes)...');

    const describeStacks = () => cfm.describeStacks({ StackName }, (err, data) => {
      if (err) {
        throw err;
      }

      const [Stack] = data.Stacks;
      const { StackStatus, Outputs } = Stack;

      switch (StackStatus) {
        case 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS':
        case 'CREATE_IN_PROGRESS':
        case 'UPDATE_IN_PROGRESS':
          setTimeout(describeStacks, 5000);
          break;

        case 'CREATE_COMPLETE':
        case 'UPDATE_COMPLETE':
          spinner.succeed(`Stack successfully ${current ? 'updated' : 'created'}!`);
          console.info(Outputs);
          process.exit(0);
          break;

        default:
          spinner.fail(`Stack ${current ? 'update' : 'creation'} failed: ${StackStatus}. Please check the AWS console (https://console.aws.amazon.com/cloudformation/home).`);
          throw err;
      }
    });

    describeStacks();
  } catch (err) {
    spinner.fail(err.message);
    console.error(err);
    process.exit(1);
  }
})();
