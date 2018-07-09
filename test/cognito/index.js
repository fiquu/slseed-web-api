/**
 * Cognito handler.
 *
 * @module tests/cognito/index
 */

const AWS = require('aws-sdk');

const profiles = require('../../configs/profiles');

const cleanup = require('./cleanup');
const create = require('./create');
const auth = require('./auth');

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
    await cleanup();
  }

  async create() {
    const credentials = await create();
    await this.auth(credentials);
  }

  async auth() {
    await auth();
  }
}

module.exports = new Cognito();
