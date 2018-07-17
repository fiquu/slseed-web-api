/**
 * Serverless deploy script.
 *
 * @module deploy
 */

const inquirer = require('inquirer');

module.exports = async env => {
  const profiles = require('../configs/profiles');

  const { profile } = await inquirer.prompt({
    name: 'profile',
    type: 'list',
    message: 'Select target profile:',
    choices: Object.keys(profiles)
  });

  if (env) {
    process.env.AWS_PROFILE = profile;
    process.env.NODE_ENV = profile;
  }

  return profile;
};
