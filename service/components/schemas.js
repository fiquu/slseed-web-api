/**
 * Schemas Component module.
 *
 * @module components/schemas
 */

const config = require('../configs/schemas');

/**
 * Registers all schemas into the connection.
 *
 * @param {Object} db The database instance object.
 */
function register(db) {
  for (let name of Object.keys(config.schemas)) {
    db.model(name, config.schemas[name]);
  }
}

module.exports = {
  register
};
