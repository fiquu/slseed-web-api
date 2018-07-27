/**
 * Auth Component module.
 *
 * @module components/auth
 */

const config = require('../configs/auth');

class Auth {
  getConfig() {
    return config;
  }
}

module.exports = new Auth();
