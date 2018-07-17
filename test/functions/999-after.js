/**
 * Authorizer function tests.
 *
 * @module tests/functions/authorizer
 */

const mochaPlugin = require('serverless-mocha-plugin');

const database = require('../../utils/test/database');
const cognito = require('../../utils/test/cognito');
const auth = require('../../utils/test/auth');

const { expect } = mochaPlugin.chai;

describe('Authorization manager', function() {
  this.timeout(60000); // Lots of stuff to do

  before(async function() {
    await database.cleanup();
    await cognito.cleanup();
    await auth.cleanup();
  });

  it('should have cleaned the created auth data', async function() {
    const databaseData = await database.getData();
    const cognitoData = await cognito.getData();
    const authData = await auth.getData();

    expect(databaseData).to.be.null;
    expect(cognitoData).to.be.null;
    expect(authData).to.be.null;
  });
});
