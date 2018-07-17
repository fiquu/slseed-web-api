/**
 * Cognito handler.
 *
 * @module tests/cognito/index
 */

const awsProfile = require('../../aws-profile');

awsProfile.update();

const AWS = require('aws-sdk');

const createUser = require('./create-user');
const authUser = require('./auth-user');
const getData = require('./get-data');
const cleanup = require('./cleanup');

class Cognito {
  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      apiVersions: {
        cognitoidentityserviceprovider: '2016-04-18',
        ssm: '2014-11-06'
      }
    });
  }

  /**
   * Cleans up saved user data.
   */
  async cleanup() {
    await cleanup();
  }

  /**
   * Creates and authorizes user.
   */
  async createUser() {
    await cleanup();
    return await createUser();
  }

  /**
   * Authorizes a user's credentials.
   *
   * @param {Object} credentials The credentials object.
   */
  async authUser(credentials) {
    await authUser(credentials);
  }

  /**
   * Retrieves cognito auth data.
   */
  async getData() {
    return await getData();
  }
}

module.exports = new Cognito();
