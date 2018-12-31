/**
 * Serverless configuration.
 *
 * @see https://serverless.com/framework/docs/providers/aws/
 */

const argv = require('yargs').argv;

const { profiles } = require('./configs/aws');

/* Force NODE_ENV to equal Serverless' stage */
process.env.NODE_ENV = argv.stage;

/* Set proper AWS stage profile */
process.env.AWS_PROFILE = profiles[argv.stage] || 'default';

/* Service Name */
module.exports.service = require('./package.json').name;

/* Provider specification */
module.exports.provider = require('./configs/provider');

/* Package specification */
module.exports.package = require('./configs/package');

/* Plugins definition */
module.exports.plugins = require('./configs/plugins');

/* Custom values definition */
module.exports.custom = require('./configs/custom');

/* Provider resources configuration */
module.exports.resources = require('./configs/resources');

/* Service functions declaration */
module.exports.functions = require('./configs/functions');
