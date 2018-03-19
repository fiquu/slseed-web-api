const { Types } = require('mongoose');

const { BadRequest, Forbidden, NoContent, Ok } = require('../../../components/responses');
const Request = require('../../../components/request');

const { ObjectId } = Types;

const NOTIFICATION = 'notification';
const TO_MODEL = 'toModel';
const DISMISSED_AT = 'dismissedAt';
const MONITOR = 'monitor';
const TO_ID = 'toId';
const ID = '_id';

/**
 * Notifications by id handler function.
 *
 * @param {Object} event Call event object.
 * @param {Object} context Context object.
 * @param {Function} callback Callback function.
 */
module.exports.handler = (event, context, callback) => {
  const req = new Request(event, context, callback);
  const authData = req.getAuthData();
  const _id = req.getParam(ID);

  if (!authData) {
    req.send(new Forbidden());
    return;
  }

  if (!ObjectId.isValid(_id)) {
    req.send(new BadRequest());
    return;
  }

  req.db
    .connect()

    .then(() => {
      const query = req.db.model(NOTIFICATION).findById(_id);

      query.where(TO_MODEL).equals(MONITOR);
      query.where(TO_ID).equals(authData._id);
      query.where(DISMISSED_AT).equals(null);

      query.populate('from', 'citizen.name');
      query.populate('ref', '_id');
      // query.populate('to');

      return query;
    })

    .then(notification => {
      if (!notification || !notification._id) {
        req.send(new NoContent());
        return;
      }

      req.send(new Ok(notification));
    })

    .catch(err => req.send(err));
};
