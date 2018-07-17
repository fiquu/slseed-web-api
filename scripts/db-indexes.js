/**
 * Database indexes script.
 *
 * Drops and ensures indexes are created appropriately.
 *
 * @example $ NODE_ENV=local node scripts/db-indexes.js
 */

const awsProfile = require('../utils/aws-profile');

awsProfile.update();

const inquirer = require('inquirer');
const mongoose = require('mongoose');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const schemas = require('../service/components/schemas');
const ssmr = require('../utils/ssm-params-resolve');

AWS.config.update({
  region: 'us-east-1',
  apiVersions: {
    ssm: '2014-11-06'
  }
});

console.log(`\n${chalk.cyan.bold('Database Indexes Script')}\n`);

mongoose.set('debug', true);

(async () => {
  const spinner = ora('');

  try {
    const questions = [
      {
        name: 'drop',
        type: 'confirm',
        message: 'Drop indexes first?'
      },
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Proceed with indexing?'
      }
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.confirm) {
      console.log(chalk.bold.yellow('\nCanceled\n'));
      process.exit();
    }

    spinner.text = 'Resolving SSM parameters...';

    spinner.start();

    await ssmr(['db-uri'], true);

    spinner.succeed('SSM parameters resolved.');

    spinner.text = 'Connecting to the database...';

    spinner.start();

    const config = require('../service/configs/database');

    await mongoose.connect(
      config.uri,
      config.options
    );

    spinner.succeed('Connected to the database.');

    spinner.info(`${chalk.bold('Target:')} ${process.env.DB_URI.replace(/^mongodb:\/\/([^:]+:[^@]+@)?(.+)/, '$2')}`);

    spinner.text = 'Registering schemas...';

    spinner.start();

    schemas.register(mongoose);

    spinner.succeed('Schemas registered.');

    if (!answers.drop) {
      return null;
    }

    spinner.text = 'Dropping indexes...';

    spinner.start();

    for (let name of Object.keys(mongoose.models)) {
      await mongoose.model(name).collection.dropIndexes();
    }

    spinner.succeed('Indexes dropped!');

    spinner.text = 'Ensuring indexes...';

    spinner.start();

    for (let name of Object.keys(mongoose.models)) {
      await mongoose.model(name).ensureIndexes();
    }

    spinner.succeed('Indexes ensured!');

    await mongoose.disconnect();

    spinner.info('Database connection closed.');
  } catch (err) {
    spinner.fail(err.message);

    console.error(err);

    process.exit(1);
  }
})();
