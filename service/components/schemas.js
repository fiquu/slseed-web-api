/**
 * Schemas Component module.
 *
 * @module components/schemas
 */

const mongoose = require('mongoose');
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
   */
  static register() {
    for (let name of config.schemas) {
      const relative = path.join(config.basedir, name);
      const full = path.resolve(path.normalize(relative));

      const schema = require(full);

      mongoose.model(name, schema);
    }
  }
}

module.exports = Schemas;
