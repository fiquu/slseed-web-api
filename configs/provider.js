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
  runtime: 'nodejs8.10',
  stage: '${opt:stage}',

  logRetentionInDays: process.env.NODE_ENV === 'production' ? 14 : 7,
  memorySize: 512,
  timeout: 30,

  environment
};
