const plugins = {
  development: [],
  production: [],
  staging: [],
  testing: [],
  local: [
    'serverless-offline'
  ]
};

module.exports = [
  'serverless-plugin-typescript',
  'serverless-dotenv-plugin',
  'serverless-mocha-plugin',
  'serverless-prune-plugin',

  ...plugins[process.env.NODE_ENV]
];
