/**
 * Database component module.
 *
 * @module components/database
 */

const mongoose = require('mongoose');

const { uri, options } = require('../configs/database');
const Schemas = require('./schemas');

const log = require('./logger')('Database');

/* Do not log queries on production or testing environments */
mongoose.set('debug', ['production', 'testing'].indexOf(process.env.NODE_ENV) < 0);

/**
 * Database component class.
 *
 * Handles the database connection and schemas.
 *
 * @class Database
 */
class Database {
  /**
   * Creates a connection to the database or reuses it if present.
   *
   * @returns {Object} The Mongoose connection object.
   */
  async connect () {
    const { connection } = mongoose;

    log.debug(`Connection ready state: ${connection.readyState}`);

    switch (connection.readyState) {
      case connection.states.connecting:
      case connection.states.connected:
        log.debug('Reusing current connection...');
        break;

      default:
        log.debug('Connecting...');

        await mongoose.connect(uri, options);

        Schemas.register();
    }

    return connection;
  }

  /**
   * Closes the database connection.
   */
  async disconnect () {
    try {
      log.debug('Disconnecting...');
      await mongoose.disconnect();
    } catch (err) {
      /* Here you could handle a disconnection error more graciously */
      /* istanbul ignore next */
      log.error(err);
    }
  }

  /**
   * Proxy for the Mongoose `model` method.
   */
  model (...args) {
    return mongoose.model(...args);
  }
}

module.exports = Database;
