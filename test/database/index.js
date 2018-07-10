/**
 * Database handler.
 *
 * @module tests/database/index
 */

const awsProfile = require('../../utils/aws-profile');

awsProfile.update();

const createUser = require('./create-user');
const cleanup = require('./cleanup');

class Database {
  async createUser(sub) {
    await createUser(sub);
  }

  async cleanup() {
    await cleanup();
  }
}

module.exports = new Database();
