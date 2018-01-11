/**
 * Database Component module.
 *
 * @module components/database
 */

const mongoose = require('mongoose');

const config = require('../configs/database');
const schemas = require('./schemas');

mongoose.Promise = Promise;

class Database {
  /**
   * Creates an instance of Database.
   *
   * @constructor
   */
  constructor() {
    this.schemas = schemas;
    this.connected = false;
  }

  /**
   * Creates a connection to the database.
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      mongoose
        .connect(config.uri, config.options)

        .then(() => {
          this.connected = true;
          resolve();
        })

        .catch(err => reject(err));
    });
  }

  /**
   * Closes the database connection.
   */
  disconnect() {
    if (this.connected) {
      this.connected = false;
      return mongoose.disconnect();
    }

    return new Promise(resolve => resolve());
  }

  /**
   * Creates the model for the current database connection.
   *
   * @param {Object} schema The Mongoose schema to create the model.
   *
   * @returns {Object} The model.
   */
  model(name) {
    return this.schemas.model(name);
  }
}

module.exports = Database;
