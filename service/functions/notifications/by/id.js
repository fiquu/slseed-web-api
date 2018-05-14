const { Types } = require('mongoose');

const { BadRequest, Forbidden, NoContent, Ok } = require('../../../components/responses');
const Request = require('../../../components/request');

const { ObjectId } = Types;

/**
 * Notifications by id handler function.
 *
 * @param {Object} event Call event object.
 */
module.exports.handler = async event => {
  const req = new Request(event);

  const authData = req.getAuthData();
  const _id = req.getParam('_id');

  if (!authData) {
    req.send(new Forbidden());
    return;
  }

  if (!ObjectId.isValid(_id)) {
    req.send(new BadRequest());
    return;
  }

  try {
    await req.db.connect();

    const query = req.db.model('notification').findById(_id);

    query.where('toModel').equals('user');
    query.where('toId').equals(authData._id);
    query.where('dismissedAt').equals(null);

    query.populate('from', 'citizen.name');
    query.populate('ref', '_id');
    // query.populate('to');

    const notification = await query;

    if (!notification || !notification._id) {
      return new NoContent();
    }

    return new Ok(notification);
  } catch (err) {
    return req.send(err);
  }
};
