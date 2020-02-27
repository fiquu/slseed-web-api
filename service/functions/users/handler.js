const { Forbidden, NoContent, Ok } = require('../../components/responses');
const Request = require('../../components/request');

/**
 * Users handler function.
 *
 * @param {Object} event Call event object.
 *
 * @returns {Object|Error} The response.
 */
module.exports.handler = async event => {
  const req = new Request(event);

  try {
    await req.db.connect();

    const auth = await req.getAuthData(); // Authorization data

    if (!auth) {
      return new Forbidden();
    }

    const query = req.db.model('user').find();
    const users = await query.lean();

    if (!users || !users.length) {
      return new NoContent();
    }

    return new Ok(users);
  } catch (err) {
    return req.send(err);
  }
};
