/* eslint-disable node/no-unpublished-require */
require('ts-node').register();  // Allows `require` of TypeScript files

const { argv } = require('yargs');
const slug = require('url-slug');

const { profiles } = require('./configs/aws');
const { name } = require('./package.json');

// Force NODE_ENV to equal Serverless' stage
process.env.NODE_ENV = argv.stage;

// Set proper AWS stage profile
process.env.AWS_PROFILE = profiles[String(argv.stage)];

module.exports = {
  service: slug(name),

  resources: require('./configs/serverless/resources'),
  functions: require('./configs/serverless/functions'),
  provider: require('./configs/serverless/provider'),
  package: require('./configs/serverless/package'),
  plugins: require('./configs/serverless/plugins'),
  custom: require('./configs/serverless/custom')
};
