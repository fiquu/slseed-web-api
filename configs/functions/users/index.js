/**
 * Serverless Users Index function configuration module.
 *
 * @module configs/functions/users/index
 */

module.exports = {
  description: 'Users index function.',
  handler: 'service/functions/users/index.handler',
  events: [
    {
      http: {
        method: 'get',
        path: 'users',
        cors: true,
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
