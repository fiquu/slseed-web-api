/**
 * Auth create and authorize user handler.
 *
 * @module tests/auth/create-and-auth-user
 */

const database = require('../database');
const cognito = require('../cognito');

module.exports = async () => {
  const credentials = await cognito.createUser();

  await cognito.authUser(credentials);

  const authData = await cognito.getData();

  await database.createUser(authData.User.Username);
};
