/**
 * Serverless package configuration module.
 *
 * @module configs/package
 */

module.exports = {
  exclude: ['**/**', '!node_modules/**', 'service/functions/**/config.js'],
  include: ['service/**']
};
