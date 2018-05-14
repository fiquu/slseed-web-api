/**
 * Test function tests.
 *
 * @module tests/test
 */

const mochaPlugin = require('serverless-mocha-plugin');

const wrapped = mochaPlugin.getWrapper('test', '/service/functions/test.js', 'handler');
const { expect } = mochaPlugin.chai;

describe('test', () => {
  it('should respond 204', async () => {
    const res = await wrapped.run({});

    expect(res).to.be.ok;
    expect(res.statusCode).to.equal(204);
    expect(res.body).to.be.empty;
  });
});
