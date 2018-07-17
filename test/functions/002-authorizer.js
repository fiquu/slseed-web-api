/**
 * Authorizer function tests.
 *
 * @module tests/functions/authorizer
 */

const mochaPlugin = require('serverless-mocha-plugin');

const wrapped = mochaPlugin.getWrapper('authorizer', '/service/functions/authorizer.js', 'handler');
const { expect } = mochaPlugin.chai;

const cognito = require('../../utils/test/cognito');
const auth = require('../../utils/test/auth');

describe('authorizer', function() {
  this.timeout(30000);

  it('should not authorize a user without a token', async function() {
    const res = await wrapped.run({
      headers: {}
    });

    expect(res).to.equal('Unauthorized');
  });

  it('should not authorize a user with an invalid a token', async function() {
    const res = await wrapped.run({
      headers: {
        Authorization: 'im-invalid-lol'
      }
    });

    expect(res).to.equal('Unauthorized');
  });

  it('should authorize a user with a valid a token', async function() {
    const authData = await cognito.getData();

    const { jwtToken } = authData.idToken;

    const res = await wrapped.run({
      headers: {
        Authorization: jwtToken
      }
    });

    expect(res).to.not.equal('Unauthorized');
    expect(res.principalId).to.be.a('string');
    expect(res.context).to.be.an('object');
    expect(res.context.data).to.be.a('string');

    await auth.saveData(res.context.data);
  });
});
