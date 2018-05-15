const Request = require('../components/request');
const auth = require('../components/auth');

const config = require('../configs/auth');

/**
 * Authorizer handler function.
 *
 * @param {Object} event Call event object.
 */
module.exports.handler = async event => {
  const req = new Request(event);

  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    console.error('No authorization token found!');
    return 'Unauthorized';
  }

  try {
    const decoded = await auth.authorize(token, event.methodArn);

    await req.db.connect();

    const query = req.db.model(config.model).aggregate();

    query.match({ sub: decoded.sub });

    if (config.pipeline) {
      query.append(config.pipeline);
    }

    const [data] = await query;

    if (!data || !data._id) {
      throw new Error('No auth data found.');
    }

    const policy = auth.generatePolicy(decoded.sub, 'ALLOW', event.methodArn, {
      data: JSON.stringify(data)
    });

    return policy;
  } catch (err) {
    console.error('Authorization Error:', err.message);
    return 'Unauthorized';
  }
};
