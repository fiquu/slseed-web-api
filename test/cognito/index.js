/**
 * Cognito handler.
 *
 * @module tests/cognito/index
 */

const awsProfile = require('../../utils/aws-profile');

awsProfile.update();

const AWS = require('aws-sdk');
const fs = require('fs');

const createUser = require('./create-user');
const authUser = require('./auth-user');
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
    await this.cleanup();

    const credentials = await createUser();

    await this.authUser(credentials);
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
    return await new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/data.json`, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = new Cognito();
