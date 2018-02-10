const Database = require('../components/database');
const auth = require('../components/auth');

const config = require('../configs/auth');

const UNAUTHORIZED = 'Unauthorized';
const ALLOW = 'allow';

/**
 * Authorizer handler function.
 *
 * @param {Object} event Call event object.
 * @param {Object} context Context object.
 * @param {Function} callback Callback function.
 */
module.exports.handler = (event, context, callback) => {
  const token = event.headers.Authorization || event.headers.authorization;
  const db = new Database();

  if (!token) {
    console.error('No authorization token found!');

    callback(UNAUTHORIZED);

    return;
  }

  auth
    .authorize(token, event.methodArn)

    .then(decoded => db.connect().then(() => decoded))

    .then(decoded => {
      const query = db.model(config.model).aggregate();

      query.match({ sub: decoded.sub });

      if (config.pipeline) {
        query.append(config.pipeline);
      }

      return query.then(([data]) => [decoded, data]);
    })

    .then(([decoded, data]) => {
      if (!data || !data._id) {
        throw new Error('No auth data found.');
      }

      const policy = auth.generatePolicy(decoded.sub, ALLOW, event.methodArn, {
        data: JSON.stringify(data)
      });

      return db.disconnect().then(() => policy);
    })

    .then(policy => callback(null, policy))

    .catch(err => {
      console.error('Authorization:', err);

      callback(UNAUTHORIZED);

      return db.disconnect();
    });
};
