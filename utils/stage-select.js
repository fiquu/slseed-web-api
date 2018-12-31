/**
 * Serverless deploy script.
 *
 * @module deploy
 */

const inquirer = require('inquirer');

module.exports = async env => {
  const { profiles } = require('../configs/aws');

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

  return profile;
};
