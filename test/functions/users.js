/**
 * Test function tests.
 *
 * @module tests/functions/test
 */

const mochaPlugin = require('serverless-mocha-plugin');

const wrapped = mochaPlugin.getWrapper('users', '/service/functions/users/index.js', 'handler');
const { expect } = mochaPlugin.chai;

describe('users', () => {
  it('should respond OK (200)', async () => {
    const res = await wrapped.run({});

    expect(res).to.be.ok;
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.not.be.empty;
  });
});
