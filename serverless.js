/**
 * Serverless configuration.
 *
 * @module serverless
 */

const argv = require('yargs').argv;

/* Force NODE_ENV to equal Serverless' stage */
process.env.NODE_ENV = argv.stage;

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
