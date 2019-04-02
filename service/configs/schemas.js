/**
 * Schemas config module.
 *
 * @module configs/schemas
 */

const path = require('path');

/* List all the schemas you want to import here */
/* You can use paths too relative to the `schemas` folder */
module.exports = {
  basedir: path.join(__dirname, '..', 'schemas'),
  schemas: ['user', 'notification']
};
