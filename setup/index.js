const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

(async () => {
  const { setup } = await inquirer.prompt({
    choices: fs
      .readdirSync('./setup')
      .filter(file => path.extname(file) === '.js' && path.basename(file, '.js') !== 'index')
      .map(file => file.replace('.js', '')),
    message: 'Select setup',
    type: 'list',
    name: 'setup'
  });

  require(`./${setup}`);
})();
