/**
 * SSM params resolve util.
 *
 * Resolves the provided SSM params and assigns them to the `process.env` object if specified.
 *
 * @example
 *  const ssmr = require('ssm-param-resolve');
 *
 *  ssmr(['param-1', 'param-2'], true); // available as `PARAM_1` and `PARAM_2` on `process.env`
 *  ssmr(['param-1', 'param-2']); // Returns `{ 'param-1': 'foo', 'param-2': 'bar' }`
 */

const AWS = require('aws-sdk');

const package = require('../package.json');

AWS.config.update({
  region: 'us-east-1',
  apiVersions: {
    ssm: '2014-11-06'
  }
});

module.exports = async (params, env) => {
  const ssm = new AWS.SSM();

  const mappings = {};

  for (let param of params) {
    mappings[`/${package.group.name}/${process.env.NODE_ENV}/${param}`] = String(param)
      .toUpperCase()
      .replace(/[^\w\d]+/gi, '_');
  }

  return await new Promise((resolve, reject) => {
    const params = {
      Names: Object.keys(mappings),
      WithDecryption: true
    };

    ssm.getParameters(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (env) {
        /* Map SSM parameters to env vars */
        for (let param of data.Parameters) {
          process.env[mappings[param.Name]] = param.Value;
        }

        resolve();

        return;
      }

      /* Generate and return SSM parameters object */
      const output = {};

      for (let param of data.Parameters) {
        output[param.Name] = param.Value;
      }

      resolve(output);
    });
  });
};
