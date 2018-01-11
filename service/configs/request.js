/**
 * Request config module.
 *
 * @module configs/database
 */

const { BadRequest, Conflict } = require('../components/responses');

module.exports = {
  handlers: {
    ValidationError: BadRequest,
    MongoError: BadRequest,
    11000: Conflict
  }
};
