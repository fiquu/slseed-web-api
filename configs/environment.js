/**
 * Serverless environment configuration.
 *
 * @module configs/environment
 */

const package = require('../package.json');

const values = {};
const params = [
  // 'cognito-identity-pool-id',
  'cognito-user-pool-id',
  // 'mailer-api-key',
  // 'mailer-sender',
  // 'mailer-domain',
  'db-uri'
];

/* Map al SSM parameter names to env variables */
params.forEach(name => {
  const value = `\${ssm:/${package.group.name}/\${self:provider.stage}/${name}~true}`;
  const env = name.toUpperCase().replace(/-/g, '_');

  console.log(`> SSM:ENV ${name} --> ${env} = ${value}`);

  values[env] = value;
});

values.NODE_ENV = process.env.NODE_ENV;

module.exports = values;
