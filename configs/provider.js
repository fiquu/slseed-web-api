/**
 * Serverless provider configuration.
 *
 * @module configs/provider
 */

module.exports = {
  name: 'aws',
  profile: 'default',
  runtime: 'nodejs6.10',
  memorySize: 512,
  timeout: 30,
  stage: '${opt:stage}',
  environment: require('./environment')
};
