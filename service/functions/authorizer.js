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

  try {
    const token = req.getHeader('authorization');

    if (!token) {
      throw new Error('No authorization token found!');
    }

    const decoded = await auth.authorize(token, event.methodArn);

    await req.db.connect();

    const query = req.db.model(config.model).aggregate();

    query.match({ sub: decoded.sub });

    if (config.pipeline) {
      query.append(config.pipeline);
    }

    const [result] = await query;

    if (!result || !result._id) {
      throw new Error('No auth data found.');
    }

    const policy = auth.generatePolicy(decoded.sub, 'Allow', event.methodArn, {
      data: JSON.stringify(result)
    });

    return policy;
  } catch (err) {
    console.error('Authorization Error:', err.message);
    return 'Unauthorized';
  }
};
