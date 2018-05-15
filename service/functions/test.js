const { NoContent } = require('../components/responses');

/**
 * Test handler function.
 *
 * @returns {Object|Error} The response.
 */
module.exports.handler = async event => {
  await new Promise(resolve => setTimeout(resolve(event), 1000));

  return new NoContent();
};
