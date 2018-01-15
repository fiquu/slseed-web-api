const inquirer = require('inquirer');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const package = require('../package.json');

AWS.config.update({
  region: 'us-east-1',
  apiVersions: {
    ssm: '2014-11-06'
  }
});

const ssm = new AWS.SSM();

console.log(`\n${chalk.cyan.bold('Insert AWS Systems Manager Parameter')}\n`);
console.log(`${chalk.bold('Group:')} ${package.group.title}`);
console.log(`${chalk.bold('Path: ')} /${package.group.name}/${process.env.NODE_ENV}/\n`);

const questions = [
  {
    name: 'Description',
    type: 'input',
    message: `Description ${chalk.reset.gray('(without group name)')}`,
    filter: val => val && `${package.group.title} ${val}.`,
    validate: val => val && val.length > package.group.title.length + 2
  },
  {
    name: 'Type',
    type: 'list',
    choices: ['String', 'SecureString', 'StringList'],
    default: 'String',
    message: 'Type'
  },
  {
    name: 'Name',
    type: 'input',
    message: `Name ${chalk.reset.gray('(without path)')}`,
    filter: name => `/${package.group.name}/${process.env.NODE_ENV}/${name}`
  },
  {
    name: 'Value',
    type: 'input',
    message: 'Value'
  },
  {
    name: 'Overwrite',
    type: 'confirm',
    message: 'Overwrite if exists?'
  },
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Confirm values?'
  }
];

inquirer
  .prompt(questions)
  .then(answers => {
    if (!answers.confirm) {
      console.log(chalk.bold.yellow('\nCanceled\n'));
      process.exit();
    }

    delete answers.confirm;

    const spinner = ora('Creating/updating parameter...').start();

    ssm.putParameter(answers, err => {
      if (err) {
        spinner.fail(err.message);
        process.exit(1);
      }

      spinner.succeed('Parameter created/updated!');

      process.exit(0);
    });
  })

  .catch(err => {
    console.error(err);
    process.exit(1);
  });
