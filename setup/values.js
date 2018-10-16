/**
 * Main Stack Values.
 *
 * @module setup/values
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const values = [
  {
    name: 'db-uri',
    type: 'password',
    message: `Database Connection URI:`,
    validate: val => val.length > 1,
    mask: '*'
  },
  {
    name: 'api-endpoint',
    type: 'input',
    message: `API Endpoint URI:`,
    validate: val => val.length > 1
  },
  {
    name: 'mailer-api-key',
    type: 'password',
    message: `Mailer API Key:`,
    validate: val => val.length > 1,
    mask: '*'
  },
  {
    name: 'mailer-sender',
    type: 'input',
    message: `Mailer Sender:`,
    validate: val => val.length > 1
  },
  {
    name: 'mailer-domain',
    type: 'input',
    message: `Mailer Domain:`,
    validate: val => val.length > 1
  }
];

module.exports = async () => {
  console.log(`\n${chalk.cyan.bold('SSM Parameters Setup')}\n`);

  const ssm = new AWS.SSM();
  const spinner = ora();

  try {
    const answers = await inquirer.prompt(values);

    for (let value of values) {
      spinner.text = `Creating/updating "${value.name}" parameter...`;
      spinner.start();

      await new Promise((resolve, reject) => {
        const params = {
          Name: value.name,
          Type: 'String',
          Value: answers[value.name],
          Overwrite: true
        };

        ssm.putParameter(params, (err, data) => {
          if (err || !data) {
            reject(err);
            return;
          }

          if (data.Version > 1) {
            spinner.succeed(`Parameter updated to version ${data.Version}!`);
          } else {
            spinner.succeed(`Parameter created!`);
          }

          resolve();
        });
      });
    }

    spinner.succeed('Stack created!');

    process.exit(0);
  } catch (err) {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  }
};
