/**
 * Before tests.
 *
 * @module tests/before
 */

const mochaPlugin = require('serverless-mocha-plugin');

const database = require('../database');
const cognito = require('../cognito');
const auth = require('../auth');

const { expect } = mochaPlugin.chai;

describe('Authorization manager', function() {
  this.timeout(60000); // Lots of stuff to do

  before(async function() {
    await auth.createAndAuthUser();
  });

  it('should have created and authorized a test user', async function() {
    const databaseData = await database.getData();
    const congitoData = await cognito.getData();

    expect(databaseData).to.be.ok;
    expect(databaseData).to.be.an('object');
    expect(congitoData).to.be.ok;
    expect(congitoData).to.be.an('object');
  });
});
