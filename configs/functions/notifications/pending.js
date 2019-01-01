/**
 * Notifications Pending function configuration module.
 *
 * @module configs/functions/notifications/pending
 */

module.exports = {
  description: 'Retrieves all pending Notifications.',
  handler: 'service/functions/notifications/pending.handler',
  events: [
    {
      http: {
        method: 'get',
        path: 'notifications/pending',
        cors: true,
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
