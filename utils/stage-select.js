/**
 * Stage select script.
 *
 * @module utils/stage-select
 */

const inquirer = require('inquirer');
const AWS = require('aws-sdk');

module.exports = async env => {
  const { region, profiles } = require('../configs/aws');

  const { profile } = await inquirer.prompt({
    name: 'profile',
    type: 'list',
    message: 'Select target stage:',
    choices: Object.keys(profiles)
  });

  if (env) {
    process.env.AWS_PROFILE = profiles[profile];
    process.env.NODE_ENV = profile;
  }

  // Update AWS config
  AWS.config.update({
    region,
    credentials: new AWS.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE
    })
  });

  return profile;
};
