/**
 * Test function tests.
 *
 * @module tests/functions/test
 */

const mochaPlugin = require('serverless-mocha-plugin');

const wrapped = mochaPlugin.getWrapper('users', '/service/functions/users/index.js', 'handler');
const { expect } = mochaPlugin.chai;

const auth = require('../auth');

describe('users', function() {
  this.timeout(30000);

  it('should respond OK (200)', async function() {
    const data = await auth.getData();

    const res = await wrapped.run({
      requestContext: {
        authorizer: {
          data: JSON.stringify(data)
        }
      }
    });

    console.dir(data, { colors: true });

    expect(res).to.be.ok;
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.not.be.empty;
  });
});
