const { Forbidden, NoContent, Ok } = require('../../components/responses');
const Request = require('../../components/request');

/**
 * Notifications pending handler function.
 *
 * @param {Object} event Call event object.
 */
module.exports.handler = async event => {
  const req = new Request(event);
  const authData = req.getAuthData();

  if (!authData) {
    return new Forbidden();
  }

  try {
    await req.db.connect();

    const query = req.db.model('notification').find();

    query.where('toModel').equals('user');
    query.where('toId').equals(authData._id);
    query.where('dismissedAt').equals(null);

    query.populate('from', 'citizen.name');
    query.populate('ref', '_id');
    // query.populate('to');

    const notifications = await query;

    if (!notifications || !notifications.length) {
      return new NoContent();
    }

    return new Ok(notifications);
  } catch (err) {
    return req.send(err);
  }
};
