const plugins = [
  'serverless-plugin-typescript',
  'serverless-dotenv-plugin',
  'serverless-prune-plugin'
];

/* Set per-stage plugins */
switch (process.env.NODE_ENV) {
  case 'production':
  case 'staging':
    break;

  case 'development':
    break;

  case 'testing':
    plugins.push('serverless-mocha-plugin');
    break;

  case 'local':
    plugins.push('serverless-offline');
    break;
}

module.exports = plugins;
