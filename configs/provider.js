const { profiles } = require('./aws');

module.exports = {
  name: 'aws',
  profile: profiles[String(process.env.NODE_ENV)],
  runtime: 'nodejs12',
  stage: '${opt:stage}',

  logRetentionInDays: process.env.NODE_ENV === 'production' ? 14 : 7,
  memorySize: 512,
  timeout: 30
};
