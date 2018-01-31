/**
 * Serverless provider configuration.
 *
 * @module configs/provider
 */

const environment = require('./environment');
const profiles = require('./profiles');

module.exports = {
  name: 'aws',
  profile: profiles[process.env.NODE_ENV],
  runtime: 'nodejs6.10',
  stage: '${opt:stage}',

  memorySize: 512,
  timeout: 30,

  environment
};
