const { Forbidden, Ok } = require('../components/responses');

const Request = require('../components/request');

/**
 * Session handler function.
 *
 * @returns {Object|Error} The response.
 */
module.exports.handler = async event => {
  const req = new Request(event);

  try {
    await req.db.connect();

    const auth = await req.getAuthData();

    if (!auth) {
      return new Forbidden();
    }

    return new Ok(auth);
  } catch (error) {
    return req.send(error);
  }
};
