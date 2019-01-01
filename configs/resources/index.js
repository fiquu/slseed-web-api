/**
 * Serverless resources configuration module.
 *
 * @module configs/resources
 */

const responses = require('./responses');

module.exports = {
  Resources: {
    ...responses
  }
};
