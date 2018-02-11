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
    this.connected = false;
    this.schemas = schemas;
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
    return new Promise(resolve => {
      if (process.env.IS_OFFLINE === 'true' || !this.connected) {
        resolve();
        return;
      }

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
    return this.schemas.model(name);
  }
}

module.exports = Database;
