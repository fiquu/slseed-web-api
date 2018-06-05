/**
 * Database Component module.
 *
 * @module components/database
 */

const mongoose = require('mongoose');

const config = require('../configs/database');
const schemas = require('./schemas');

if (process.env.NODE_ENV === 'local') {
  mongoose.set('debug', true);
}

class Database {
  /**
   * Creates a connection to the database.
   */
  async connect() {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(
      config.uri,
      config.options
    );

    schemas.register(mongoose);
  }

  /**
   * Closes the database connection.
   */
  async disconnect() {
    try {
      await mongoose.disconnect();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Creates the model for the current database connection.
   *
   * @param {Object} schema The Mongoose schema to create the model.
   *
   * @returns {Object} The model.
   */
  model(name) {
    return mongoose.model(name);
  }
}

module.exports = Database;
