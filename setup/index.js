const { basename } = require('path');
const inquirer = require('inquirer');
const glob = require('glob');

(async () => {
  const { file } = await inquirer.prompt({
    choices: glob.sync('./setup/!(index).js').map(file => basename(file, '.js')),
    message: 'Select setup to run',
    type: 'list',
    name: 'file'
  });

  require(`./${file}`);
})();
