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
  connect() {
    return new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
        return;
      }

      mongoose
        .connect(config.uri, config.options)

        .then(() => {
          schemas.register(mongoose);
          resolve();
        })

        .catch(err => reject(err));
    });
  }

  /**
   * Closes the database connection.
   */
  disconnect() {
    return new Promise(resolve => {
      mongoose
        .disconnect()

        .then(() => resolve())

        .catch(() => resolve());
    });
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
