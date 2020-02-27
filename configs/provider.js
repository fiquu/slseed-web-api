/**
 * Serverless provider configuration module.
 *
 * @module configs/provider
 */

const { profiles } = require('./aws');

module.exports = {
  name: 'aws',
  profile: profiles[process.env.NODE_ENV],
  runtime: 'nodejs12',
  stage: '${opt:stage}',

  logRetentionInDays: process.env.NODE_ENV === 'production' ? 14 : 7,
  memorySize: 512,
  timeout: 30
};
