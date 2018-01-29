/**
 * Serverless plugins configuration.
 *
 * @module configs/plugins
 */

if (process.env.NODE_ENV === 'production') {
  module.exports = ['serverless-domain-manager'];
} else {
  module.exports = ['serverless-offline'];
}
