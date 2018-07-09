/**
 * Cognito handler.
 *
 * @module tests/cognito/index
 */

const AWS = require('aws-sdk');
const fs = require('fs');

const profiles = require('../../configs/profiles');

const cleanupUser = require('./cleanup');
const createUser = require('./create');
const authUser = require('./auth');

process.env.AWS_PROFILE = profiles[process.env.NODE_ENV] || 'default';

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

  async cleanup() {
    await cleanupUser();
  }

  async create() {
    await this.cleanup();

    const credentials = await createUser();

    await this.auth(credentials);
  }

  async auth(credentials) {
    await authUser(credentials);
  }

  async getAuthData() {
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
