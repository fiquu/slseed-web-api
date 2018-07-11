const fs = require('fs');

const createAndAuthUser = require('./create-and-auth-user');
const saveData = require('./save-data');
const cleanup = require('./cleanup');

class Auth {
  /**
   * Creates and authorizes a user.
   */
  async createAndAuthUser() {
    this.cleanup();

    await createAndAuthUser();
  }

  /**
   * Cleans up saved user data.
   */
  async cleanup() {
    await cleanup();
  }

  /**
   * Saves auth data.
   *
   * @param {String} data The data as a JSON string.
   */
  async saveData(data) {
    await saveData(data);
  }

  /**
   * Retrieves auth data.
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

module.exports = new Auth();
