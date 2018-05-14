/**
 * Test function configuration.
 *
 * @module configs/functions/test
 */

module.exports = {
  description: 'Users index function.',
  handler: 'service/functions/test.handler',
  events: [
    {
      http: {
        method: 'get',
        path: 'test',
        cors: true
      }
    }
  ]
};
