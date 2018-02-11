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
  }

  /**
   * Creates a connection to the database.
   */
  connect() {
    return new Promise((resolve, reject) =>
      mongoose
        .connect(config.uri, config.options)

        .then(() => resolve())

        .catch(err => reject(err))
    );
  }

  /**
   * Closes the database connection.
   */
  disconnect() {
    return new Promise(resolve =>
      mongoose
        .disconnect()

        .then(() => resolve())

        .catch(() => resolve())
    );
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
