/**
 * Serverless deploy script.
 *
 * @module deploy
 */

const inquirer = require('inquirer');
const fs = require('fs');

(async () => {
  const profiles = require('./configs/profiles');

  const answers = await inquirer.prompt({
    name: 'profile',
    type: 'list',
    message: 'Select deployment target profile:',
    choices: Object.keys(profiles)
  });

  fs.writeFile('.deploy-stage', answers.profile, err => {
    if (err) {
      throw err;
    }

    process.exit(0);
  });
})();
