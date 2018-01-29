/**
 * Serverless provider configuration.
 *
 * @module configs/provider
 */

const provider = {
  name: 'aws',
  profile: 'default',
  runtime: 'nodejs6.10',
  memorySize: 512,
  timeout: 30,
  stage: '${opt:stage}',
  environment: require('./environment')
};

if (process.env.NODE_ENV === 'production') {
  provider.profile = 'production';
}

module.exports = provider;
