/**
 * Database handler.
 *
 * @module tests/database/index
 */

const fs = require('fs');

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

module.exports = new Database();
