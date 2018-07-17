/**
 * Database handler.
 *
 * @module tests/database/index
 */

const awsProfile = require('../../aws-profile');

awsProfile.update();

const createUser = require('./create-user');
const getData = require('./get-data');
const cleanup = require('./cleanup');

class Database {
  async createUser(sub) {
    await createUser(sub);
  }

  async cleanup() {
    await cleanup();
  }

  /**
   * Retrieves cognito auth data.
   */
  async getData() {
    return await getData();
  }
}

module.exports = new Database();
