const inquirer = require('inquirer');

(async () => {
  const { setup } = await inquirer.prompt({
    message: 'Select setup',
    choices: ['env', 'stack'],
    type: 'list',
    name: 'setup'
  });

  require(`./${setup}`);
})();
