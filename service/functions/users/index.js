const { Forbidden, NoContent, Ok } = require('../../components/responses');
const Request = require('../../components/request');

const USER = 'user';

/**
 * Users index handler function.
 *
 * @param {Object} event Call event object.
 * @param {Object} context Context object.
 * @param {Function} callback Callback function.
 */
module.exports.handler = (event, context, callback) => {
  const req = new Request(event, context, callback);
  const auth = req.getAuthData(); // Authorization resolved data

  if (!auth) {
    req.send(new Forbidden());
    return;
  }

  req
    .initDb()

    .then(() => {
      const query = req.db.model(USER).find();

      return query.lean();
    })

    .then(users => {
      if (!users || !users.length) {
        req.send(new NoContent());
        return;
      }

      req.send(new Ok(users));
    })

    .catch(err => req.send(err));
};
