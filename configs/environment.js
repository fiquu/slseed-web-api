/**
 * Serverless environment configuration.
 *
 * @module configs/environment
 */

module.exports = {
  // SLSEED_COGNITO_INSTANCE_USER_POOL_ID: '${ssm:/slseed/${self:provider.stage}/cognito-instance1-user-pool-id~true}',
  // SLSEED_MAILER_API_KEY: '${ssm:/slseed/${self:provider.stage}/mailer-api-key~true}',
  // SLSEED_MAILER_SENDER: '${ssm:/slseed/${self:provider.stage}/mailer-sender~true}',
  // SLSEED_MAILER_DOMAIN: '${ssm:/slseed/${self:provider.stage}/mailer-domain~true}',
  SLSEED_DB_URI: '${ssm:/slseed/${self:provider.stage}/db-uri~true}',
  NODE_ENV: process.env.NODE_ENV
};
