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
  // const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

  const userPool = new CognitoIdentityServiceProvider.CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_APP_CLIENT_ID
  });

  //User
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

  const authenticationDetails = new CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

  const session = await new Promise((resolve, reject) => {
    const responseFunctions = {
      onSuccess: result => {
        resolve(result);
      },

      onFailure: err => {
        reject(err);
      }
    };

    // newPasswordRequired has to be added separately because it sends responseFunctions to completeNewPasswordChallenge
    responseFunctions.newPasswordRequired = userAttributes => {
      delete userAttributes.email_verified;

      cognitoUser.completeNewPasswordChallenge(
        `${Password}@1`,
        {
          email: Username
        },
        responseFunctions
      );
    };

    cognitoUser.authenticateUser(authenticationDetails, responseFunctions);
  });

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
      err ? reject(err) : resolve();
    });
  });
};
