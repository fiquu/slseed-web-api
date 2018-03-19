/**
 * Notifications Dismiss function configuration.
 *
 * @module configs/functions/notifications/dismiss
 */

module.exports = {
  description: 'Dismisses all matching Notifications.',
  handler: 'service/functions/notifications/dismiss.handler',
  events: [
    {
      http: {
        method: 'put',
        path: 'notifications/dismiss',
        cors: true,
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
