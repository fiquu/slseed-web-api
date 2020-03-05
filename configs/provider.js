const { profiles } = require('./aws');

module.exports = {
  profile: profiles[String(process.env.NODE_ENV)],
  runtime: 'nodejs12.x',
  stage: '${opt:stage}',
  name: 'aws',

  logRetentionInDays: process.env.NODE_ENV === 'production' ? 14 : 7,
  memorySize: 512,
  timeout: 30
};
