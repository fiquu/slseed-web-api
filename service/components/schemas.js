/**
 * Schemas Component module.
 *
 * @module components/schemas
 */

const path = require('path');

const config = require('../configs/schemas');

/**
 * Schemas Component Class.
 *
 * @class Schemas
 */
class Schemas {
  /**
   * Registers all schemas into the connection.
   *
   * @param {Object} db The database instance object.
   */
  static register(db) {
    for (let name of config.schemas) {
      const relative = path.join(config.basedir, name);
      const full = path.resolve(path.normalize(relative));

      const schema = require(full);

      db.model(name, schema);
    }
  }
}

module.exports = Schemas;
