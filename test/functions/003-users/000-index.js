/**
 * Test function tests.
 *
 * @module tests/functions/test
 */

const mochaPlugin = require('serverless-mocha-plugin');

const wrapped = mochaPlugin.getWrapper('users', '/service/functions/users/index.js', 'handler');
const { expect } = mochaPlugin.chai;

const auth = require('../../../utils/test/auth');

describe('users', function() {
  this.timeout(30000);

  it('should respond Forbidden (403) with invalid context', async function() {
    const res = await wrapped.run({});

    expect(res).to.be.ok;
    expect(res.statusCode).to.equal(403);
    expect(res.body).to.be.empty;
  });

  it('should respond OK (200) with valid context', async function() {
    const data = await auth.getData();

    console.dir(data, { colors: true });

    const res = await wrapped.run({
      requestContext: {
        authorizer: {
          data: JSON.stringify(data)
        }
      }
    });

    expect(res).to.be.ok;
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.not.be.empty;
  });
});
