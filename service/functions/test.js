const { NoContent } = require('../components/responses');

/**
 * Test handler function.
 *
 * @returns {Object|Error} The response.
 */
module.exports.handler = async event => {
  console.log('Test function is working.');
  console.dir(event, { colors: true });

  await new Promise(resolve => setTimeout(resolve, 1000));

  return new NoContent();
};
