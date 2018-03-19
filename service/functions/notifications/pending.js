const { Forbidden, NoContent, Ok } = require('../../components/responses');
const Request = require('../../components/request');

const NOTIFICATION = 'notification';
const TO_MODEL = 'toModel';
const DISMISSED_AT = 'dismissedAt';
const MONITOR = 'monitor';
const TO_ID = 'toId';

/**
 * Notifications pending handler function.
 *
 * @param {Object} event Call event object.
 * @param {Object} context Context object.
 * @param {Function} callback Callback function.
 */
module.exports.handler = (event, context, callback) => {
  const req = new Request(event, context, callback);
  const authData = req.getAuthData();

  if (!authData) {
    req.send(new Forbidden());
    return;
  }

  req.db
    .connect()

    .then(() => {
      const query = req.db.model(NOTIFICATION).find();

      query.where(TO_MODEL).equals(MONITOR);
      query.where(TO_ID).equals(authData._id);
      query.where(DISMISSED_AT).equals(null);

      query.populate('from', 'citizen.name');
      query.populate('ref', '_id');
      // query.populate('to');

      return query;
    })

    .then(notifications => {
      if (!notifications || !notifications.length) {
        req.send(new NoContent());
        return;
      }

      req.send(new Ok(notifications));
    })

    .catch(err => req.send(err));
};
