const Ably = require('ably');

const { Created, BadRequest } = require('../../components/responses');
const Request = require('../../components/request');

const NOTIFICATION = 'notification';

/**
 * Messages create handler function.
 *
 * IMPORTANT: This method is not suited to be used on production as any user could send a request to this method and
 * create notifications for any user. It is not registered as a function and use it for example purposes only.
 *
 * @param {Object} event Call event object.
 * @param {Object} context Context object.
 * @param {Function} callback Callback function.
 */
module.exports.handler = (event, context, callback) => {
  const req = new Request(event, context, callback);
  const body = req.getBody();

  if (!body) {
    req.send(new BadRequest());
    return;
  }

  const data = {
    type: body.type,

    fromModel: body.fromModel,
    fromId: body.fromId,

    toModel: body.toModel,
    toId: body.toId,

    refModel: body.refModel,
    refId: body.refId
  };

  const query = req.db.model(NOTIFICATION).create(data);

  query
    .then(notification => {
      if (!notification || !notification._id) {
        throw new BadRequest();
      }

      return new Promise(resolve => {
        const client = new Ably.Rest(process.env.ABLY_SERVER_REST_KEY);
        const channel = client.channels.get(`clients:${notification.toId}`);

        channel.publish('notification', notification._id, err => {
          /* TODO: Don't care about error handling for now */
          if (err) {
            console.log(err);
          }

          resolve();
        });
      });
    })

    .then(() => req.send(new Created()))

    .catch(err => req.send(err));
};
