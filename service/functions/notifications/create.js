const Ably = require('ably');

const { Created, BadRequest, Forbidden } = require('../../components/responses');
const Request = require('../../components/request');

/**
 * Messages create handler function.
 *
 * IMPORTANT: This method is not suited to be used on production as any user could send a request to this method and
 * create notifications for any user. It is not registered as a function and use it for example purposes only.
 *
 * @param {Object} event Call event object.
 */
module.exports.handler = async event => {
  const req = new Request(event);
  const body = req.getBody();

  if (!body) {
    return new BadRequest();
  }

  try {
    await req.db.connect();

    const authData = req.getAuthData();

    if (!authData) {
      return new Forbidden();
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

    const query = req.db.model('notification').create(data);

    const notification = await query;

    if (!notification || !notification._id) {
      throw new BadRequest();
    }

    const client = new Ably.Rest(process.env.ABLY_SERVER_REST_KEY);
    const channel = client.channels.get(`clients:${notification.toId}`);

    await new Promise(resolve =>
      channel.publish('notification', notification._id, err => {
        /* TODO: Handle errors */
        if (err) {
          console.log(err);
        }

        resolve();
      })
    );

    return new Created();
  } catch (err) {
    return req.send(err);
  }
};
