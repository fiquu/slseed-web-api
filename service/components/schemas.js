/**
 * Schemas Component module.
 *
 * @module components/schemas
 */

const mongoose = require('mongoose');

const config = require('../configs/schemas');

if (process.env.NODE_ENV === 'local') {
  mongoose.set('debug', true);
}

/**
 * Retrieves a schema object only by name.
 *
 * @param {any} name The schema name to retrieve.
 *
 * @returns {mongoose.Schema} The schema object.
 */
function get(name) {
  return config.schemas[name];
}

/**
 * Retrieves a schema's model by name.
 *
 * @param {String} name The model's name.
 *
 * @returns
 */
function model(name) {
  return mongoose.model(name);
}

/* Pre-register all schemas */
Object.keys(config.schemas).forEach(name => {
  if (!mongoose.models[name]) {
    mongoose.model(name, get(name));
  }
});

module.exports = {
  model,
  get
};
