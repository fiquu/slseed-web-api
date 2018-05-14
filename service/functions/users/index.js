const { Forbidden, NoContent, Ok } = require('../../components/responses');
const Request = require('../../components/request');

/**
 * Users index handler function.
 *
 * @param {Object} event Call event object.
 *
 * @returns {Object|Error} The response.
 */
module.exports.handler = async event => {
  const req = new Request(event);

  const auth = req.getAuthData(); // Authorization resolved data

  if (!auth) {
    return new Forbidden();
  }

  try {
    await req.db.connect();

    const query = req.db.model('user').find();
    const users = await query.lean();

    if (!users || !users.length) {
      req.send(new NoContent());
      return;
    }

    return new Ok(users);
  } catch (err) {
    return req.send(err);
  }
};
