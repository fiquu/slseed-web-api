/**
 * Test function configuration module.
 *
 * @module configs/functions/test
 */

module.exports = {
  description: 'Test function.',
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
