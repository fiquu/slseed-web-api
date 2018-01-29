/**
 * Serverless example index function configuration.
 *
 * @module configs/functions/example/index
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
