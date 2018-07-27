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

  const _id = req.getParam('_id');

  if (!ObjectId.isValid(_id)) {
    return new BadRequest();
  }

  try {
    await req.db.connect();

    const authData = req.getAuthData();

    if (!authData) {
      return new Forbidden();
    }

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
