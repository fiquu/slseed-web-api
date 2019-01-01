/**
 * Database component module.
 *
 * @module components/database
 */

const mongoose = require('mongoose');

const { uri, options } = require('../configs/database');
const Schemas = require('./schemas');

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
  async connect() {
    const { connection } = mongoose;

    switch (connection.readyState) {
      case connection.states.connecting:
      case connection.states.connected:
        break;

      default:
        await mongoose.connect(
          uri,
          options
        );

        Schemas.register();
    }

    return connection;
  }

  /**
   * Closes the database connection.
   */
  async disconnect() {
    try {
      await mongoose.disconnect();
    } catch (err) {
      /* Here you could handle a disconnection error more graciously */
      /* istanbul ignore next */
      console.error(err);
    }
  }

  /**
   * Proxy for the Mongoose `model` method.
   */
  model(...args) {
    return mongoose.model(...args);
  }
}

module.exports = Database;
