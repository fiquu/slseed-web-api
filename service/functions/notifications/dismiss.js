const { Types } = require('mongoose');

const { PreconditionFailed, Forbidden, NoContent } = require('../../components/responses');
const Request = require('../../components/request');

const { ObjectId } = Types;

const NOTIFICATION = 'notification';
const REF_MODEL = 'refModel';
const MONITOR = 'monitor';
const REF_ID = 'refId';
const TYPE = 'type';
const ID = '_id';

/**
 * Notifications dismiss handler function.
 *
 * @param {Object} event Call event object.
 * @param {Object} context Context object.
 * @param {Function} callback Callback function.
 */
module.exports.handler = (event, context, callback) => {
  const req = new Request(event, context, callback);
  const authData = req.getAuthData();

  const body = req.getBody();

  if (!authData) {
    req.send(new Forbidden());
    return;
  }

  /* No params provided */
  if (!body.refModel && !body.refId && !body.type && !body._id) {
    req.send(new PreconditionFailed());
    return;
  }

  req.db
    .connect()

    .then(() => {
      const conditions = {
        toId: authData._id,
        toModel: MONITOR
      };

      if (ObjectId.isValid(body._id)) {
        conditions._id = body._id;
      } else {
        if (body.type) {
          conditions.type = body.type;
        }

        if (body.refId && body.refModel) {
          conditions.refModel = body.refModel;
          conditions.refId = body.refId;
        }
      }

      const doc = {
        dismissedAt: new Date()
      };

      const options = {
        multi: true
      };

      return req.db.model(NOTIFICATION).update(conditions, doc, options);
    })

    .then(() => req.send(new NoContent()))

    .catch(err => req.send(err));
};
