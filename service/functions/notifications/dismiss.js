const { Types } = require('mongoose');

const { PreconditionFailed, Forbidden, NoContent } = require('../../components/responses');
const Request = require('../../components/request');

const { ObjectId } = Types;

/**
 * Notifications dismiss handler function.
 *
 * @param {Object} event Call event object.
 */
module.exports.handler = async event => {
  const req = new Request(event);

  const body = req.getBody();

  /* No params provided */
  if (!body.refModel && !body.refId && !body.type && !body._id) {
    return new PreconditionFailed();
  }

  try {
    await req.db.connect();

    const authData = req.getAuthData();

    if (!authData) {
      return new Forbidden();
    }

    const conditions = {
      toId: authData._id,
      toModel: 'user'
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

    await req.db.model('notification').update(conditions, doc, options);

    return new NoContent();
  } catch (err) {
    return req.send(err);
  }
};
