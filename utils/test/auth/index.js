/**
 * Auth utility class.
 *
 * @module tests/auth
 */

const createAndAuthUser = require('./create-and-auth-user');
const saveData = require('./save-data');
const getData = require('./get-data');
const cleanup = require('./cleanup');

class Auth {
  /**
   * Creates and authorizes a user.
   */
  async createAndAuthUser() {
    await cleanup();
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
   *
   * @return {Object} The parsed JSON data.
   */
  async getData() {
    return await getData();
  }
}

module.exports = new Auth();
