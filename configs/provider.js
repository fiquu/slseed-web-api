/**
 * Serverless provider configuration.
 *
 * @module configs/provider
 */

const provider = {
  name: 'aws',
  runtime: 'nodejs6.10',
  memorySize: 512,
  timeout: 30,
  stage: '${opt:stage}',
  environment: require('./environment')
};

/* Set per-stage profiles */
switch (process.env.NODE_ENV) {
  case 'production':
    provider.profile = 'production';
    break;

  case 'staging':
    provider.profile = 'staging';
    break;

  default:
    provider.profile = 'default';
}

module.exports = provider;
