/**
 * Env setup.
 *
 * @example $ npm run env
 *
 * @module setup/env
 */

const AWS = require('aws-sdk');
const path = require('path');
const ora = require('ora');
const fs = require('fs');

const { apiVersions, region } = require('../configs/aws');
const { name, group } = require('../package.json');
const ssmEnv = require('../configs/ssm.env');

(async () => {
  try {
    // Set proper stage ENV
    await require('../utils/stage-select')();

    let env = `NODE_ENV=${process.env.NODE_ENV}`;

    AWS.config.update({
      apiVersions,
      region
    });

    const nameSlug = name.replace(/\W+/g, '-').replace(/-+/g, '-').trim();
    const ssm = new AWS.SSM();

    const spinner = ora();

    spinner.start(`Setting env file for [${process.env.NODE_ENV}]...`);

    const promises = [];

    for (let ssmPath of ssmEnv) {
      const promise = new Promise((resolve, reject) => {
        const params = {
          Name: path.posix.join('/', group.name, nameSlug, process.env.NODE_ENV, ssmPath),
          WithDecryption: true
        };

        ssm.getParameter(params, (err, data) => {
          if (err) {
            spinner.fail(`${err.code}: ${params.Name}`);
            reject(err);
            return;
          }

          const name = ssmPath.toUpperCase().replace(/[^A-Z0-9]+/g, '_');

          spinner.info(`${name}=[ssm:${data.Parameter.Name}]`);

          env += `\n${name}=${data.Parameter.Value}`;

          resolve();
        });
      });

      promises.push(promise);
    }

    await Promise.all(promises);

    fs.writeFileSync(`.env.${process.env.NODE_ENV}`, env, 'utf8');

    spinner.succeed('Env file saved!');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
