/**
 * Serverless deploy script.
 *
 * @module deploy
 */

const { spawn } = require('child_process');
const inquirer = require('inquirer');

(async () => {
  const { profiles } = require('../configs/aws');

  const { profile } = await inquirer.prompt({
    name: 'profile',
    type: 'list',
    message: 'Select deployment target profile:',
    choices: Object.keys(profiles)
  });

  await new Promise(resolve => {
    const cmd = spawn('sls', ['deploy', '--stage', profile], {
      stdio: 'inherit',
      shell: true
    });

    cmd.on('close', () => resolve());
  });
})();
