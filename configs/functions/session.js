/**
 * Session function configuration module.
 *
 * @module configs/functions/session
 */

module.exports = {
  description: 'Session function.',
  handler: 'service/functions/session.handler',
  events: [
    {
      http: {
        method: 'get',
        path: 'session',
        cors: true
      }
    }
  ]
};
