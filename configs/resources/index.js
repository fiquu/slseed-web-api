/**
 * Serverless resources configuration.
 *
 * @module configs/resources
 */

const responses = require('./responses');

module.exports = {
  Resources: {
    ...responses
  }
};
