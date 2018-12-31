/**
 * Database Component module.
 *
 * @module components/database
 */

const mongoose = require('mongoose');

const { uri, options } = require('../configs/database');
const Schemas = require('./schemas');

/* Do not log queries on production */
mongoose.set('debug', process.env.NODE_ENV !== 'production');

/**
 * Database Class.
 *
 * Handles the database connection during the function's life cycle.
 *
 * @class Database
 */
class Database {
  /**
   * Creates a connection to the database or reuses it if present.
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
   * Creates the model for the current database connection.
   *
   * @returns {Object} The model.
   */
  model(...args) {
    return mongoose.model(...args);
  }
}

module.exports = Database;
