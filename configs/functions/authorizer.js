/**
 * Serverless authorizer function configuration.
 *
 * @module configs/functions/authorizer
 */

module.exports = {
  description: 'Handles custom Cognito user authorization and resolves associated data.',
  handler: 'service/functions/authorizer.handler'
};
