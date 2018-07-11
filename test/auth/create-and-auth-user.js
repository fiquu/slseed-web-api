/**
 * Auth create and authorize user handler.
 *
 * @module tests/auth/create-and-auth-user
 */

const database = require('../database');
const cognito = require('../cognito');

module.exports = async () => {
  await cognito.createUser();

  const authData = await cognito.getData();

  await database.createUser(authData.User.Username);
};
