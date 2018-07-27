/**
 * Serverless environment configuration.
 *
 * @module configs/environment
 */

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
for (let name of params) {
  const value = `\${ssm:/\${self:custom.package.group.name}/\${self:provider.stage}/${name}~true}`;
  const env = name.toUpperCase().replace(/[^A-Z]+/g, '_');

  console.log(`> SSM:ENV ${name} --> ${env} = ${value}`);

  values[env] = value;
}

values.NODE_ENV = process.env.NODE_ENV;

module.exports = values;
