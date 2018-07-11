/**
 * Authorizer function tests.
 *
 * @module tests/functions/authorizer
 */

const mochaPlugin = require('serverless-mocha-plugin');

const database = require('../database');
const cognito = require('../cognito');
const auth = require('../auth');

const { expect } = mochaPlugin.chai;

describe('authorizer', function() {
  this.timeout(60000); // Lots of stuff to do

  after(async function() {
    await database.cleanup();
    await cognito.cleanup();
    await auth.cleanup();
  });

  it('should clean the auth data', function() {
    expect(true).to.equal(true);
  });
});
