/**
 * Serverless configuration.
 *
 * @see https://serverless.com/framework/docs/providers/aws/
 */

require('typescript-require'); // Allows `require` of TypeScript files

const argv = require('yargs').argv;
const slug = require('url-slug');

const { name } = require('./package.json');
const { profiles } = require('./configs/aws');

// Force NODE_ENV to equal Serverless' stage
process.env.NODE_ENV = argv.stage;

// Set proper AWS stage profile
process.env.AWS_PROFILE = profiles[argv.stage] || 'default';

module.exports = {
  service: slug(name),
  provider: require('./configs/provider'),
  package: require('./configs/package'),
  plugins: require('./configs/plugins'),
  custom: require('./configs/custom'),
  resources: require('./configs/resources'),
  functions: require('./configs/functions')
};
