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

    const _id = req.getParam('_id');
    const query = req.db.model('user').findById(_id);
    const user = await query.lean();

    if (!user) {
      return new NoContent();
    }

    return new Ok(user);
  } catch (err) {
    return req.send(err);
  }
};
