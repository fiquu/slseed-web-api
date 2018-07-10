/**
 * Database indexes script.
 *
 * Drops and ensures indexes are created appropriately.
 *
 * @example $ NODE_ENV=local node scripts/db-indexes.js
 */

const profiles = require('../configs/profiles');

process.env.AWS_PROFILE = profiles[process.env.NODE_ENV] || 'default';

const inquirer = require('inquirer');
const mongoose = require('mongoose');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const ora = require('ora');

const schemas = require('../service/components/schemas');
const package = require('../package.json');

AWS.config.update({
  region: 'us-east-1',
  apiVersions: {
    ssm: '2014-11-06'
  }
});

const ssm = new AWS.SSM();

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

    await new Promise((resolve, reject) => {
      const mappings = {
        [`/${package.group.name}/${process.env.NODE_ENV}/db-uri`]: 'DB_URI'
      };

      const params = {
        Names: Object.keys(mappings),
        WithDecryption: true
      };

      ssm.getParameters(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        /* Map SSM parameters to env vars */
        data.Parameters.forEach(param => {
          if (mappings[param.Name]) {
            spinner.info(
              `SSM: ${chalk.bold(param.Name)} --> ${chalk.bold(mappings[param.Name])} = ${chalk.bold(param.Value)}`
            );

            process.env[mappings[param.Name]] = param.Value;
          }
        });

        spinner.succeed('SSM parameters resolved.');

        resolve(answers);
      });
    });

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
