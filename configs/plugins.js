const plugins = [
  'serverless-dotenv-plugin',
  'serverless-prune-plugin'
];

/* Set per-stage plugins */
switch (process.env.NODE_ENV) {
  case 'production':
    plugins.push('serverless-domain-manager');
    break;

  default:
    plugins.push('serverless-mocha-plugin');
    plugins.push('serverless-offline');
}

module.exports = plugins;
