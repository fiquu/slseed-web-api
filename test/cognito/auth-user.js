/**
 * Cognito user auth handler.
 *
 * @module tests/cognito/index
 */

const { CognitoIdentityServiceProvider } = { ...require('aws-sdk') }; // Clone
const fs = require('fs');

const Cognito = require('amazon-cognito-identity-js-node');

CognitoIdentityServiceProvider.AuthenticationDetails = Cognito.AuthenticationDetails;
CognitoIdentityServiceProvider.CognitoUserPool = Cognito.CognitoUserPool;
CognitoIdentityServiceProvider.CognitoUser = Cognito.CognitoUser;

global.navigator = () => null;

module.exports = async credentials => {
  const { Username, Password } = credentials;

  const userPool = new CognitoIdentityServiceProvider.CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_APP_CLIENT_ID
  });

  // User
  const userParams = {
    Pool: userPool,
    Username
  };

  const cognitoUser = new CognitoIdentityServiceProvider.CognitoUser(userParams);

  // Authentication
  const authenticationData = {
    Username,
    Password // 1st time use TempPassword
  };

  const authDetails = new CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

  const session = await new Promise((resolve, reject) => {
    const callbacks = {
      onSuccess: result => resolve(result),
      onFailure: err => reject(err)
    };

    // newPasswordRequired has to be added separately because it sends responseFunctions to completeNewPasswordChallenge
    callbacks.newPasswordRequired = userAttributes => {
      delete userAttributes.email_verified; // API won't take this back

      const data = {
        email: Username
      };

      // Create new password and complete challenge
      cognitoUser.completeNewPasswordChallenge(`${Password}@1`, data, callbacks);
    };

    cognitoUser.authenticateUser(authDetails, callbacks);
  });

  // Complete data with new info
  const data = await new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/data.json`, (err, data) => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });

  const json = JSON.stringify({
    ...data,
    ...session
  });

  await new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/data.json`, json, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
