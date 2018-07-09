/**
 * Cognito cleanup handler.
 *
 * @module tests/cognito/cleanup
 */

const AWS = require('aws-sdk');
const fs = require('fs');

module.exports = async () => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const data = await new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/test-data.json`, (err, data) => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        resolve();
      }
    });
  });

  // Assume everything is in check...
  if (!data) {
    return;
  }

  await new Promise((resolve, reject) => {
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: data.User.Username
    };

    cognito.adminDeleteUser(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};
