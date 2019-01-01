/**
 * Auth component module.
 *
 * @module components/auth
 */

const config = require('../configs/auth');

class Auth {
  /**
   * Returns current config.
   *
   * @returns The current Auth config.
   */
  static getConfig() {
    return config;
  }
}

module.exports = Auth;
