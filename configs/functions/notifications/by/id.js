/**
 * Notification By Id function configuration module.
 *
 * @module configs/functions/notifications/by/id
 */

module.exports = {
  description: 'Retrieves an Notification by its Id',
  handler: 'service/functions/notifications/by/id.handler',
  events: [
    {
      http: {
        method: 'get',
        path: 'notifications/by/id/{_id}',
        cors: true,
        authorizer: '${self:custom.authorizer}',
        request: {
          parameters: {
            paths: {
              _id: true
            }
          }
        }
      }
    }
  ]
};
