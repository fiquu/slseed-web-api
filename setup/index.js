/**
 * Setup script.
 *
 * Sets the environment up.
 *
 * @example $ node setup
 */

const chalk = require('chalk');

const package = require('../package.json');
const AWS = require('aws-sdk');

(async () => {
  console.log(`\n${chalk.cyan.bold('Application Setup Script')}\n`);
  console.log(`${chalk.bold('Group Title: ')} ${package.group.title}`);
  console.log(`${chalk.bold('Group Name:  ')} ${package.group.name}\n`);

  await require('../utils/stage-select')(true); // Set proper stage ENV

  AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE
    })
  });

  console.log(`\n${chalk.bold('AWS Profile: ')} ${process.env.AWS_PROFILE}`);

  const inquirer = require('inquirer');

  let answers = await inquirer.prompt({
    message: 'Setup CloudFormation stack?',
    name: 'confirm',
    type: 'confirm'
  });

  if (answers.confirm) {
    await require('./stack')();
  }

  answers = await inquirer.prompt({
    message: 'Setup Stack values?',
    name: 'confirm',
    type: 'confirm'
  });

  if (answers.confirm) {
    await require('./values')();
  }
})();
