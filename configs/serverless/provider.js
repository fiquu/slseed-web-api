const { profiles } = require('../aws');

const { SLSEED_USE_AWS_PROFILES, NODE_ENV } = process.env;

module.exports = {
  profile: SLSEED_USE_AWS_PROFILES !== 'false' ? profiles[String(NODE_ENV)] : null,
  runtime: 'nodejs12.x',
  stage: '${opt:stage}',
  name: 'aws',
  apiGateway: {
    minimumCompressionSize: 128
  },

  logRetentionInDays: NODE_ENV === 'production' ? 14 : 7,
  memorySize: 512,
  timeout: 30
};
