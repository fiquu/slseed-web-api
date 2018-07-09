/**
 * Cognito user auth handler.
 *
 * @module tests/cognito/index
 */

const { CognitoIdentityServiceProvider } = { ...require('aws-sdk') }; // Clone

const Cognito = require('amazon-cognito-identity-js-node');

CognitoIdentityServiceProvider.AuthenticationDetails = Cognito.AuthenticationDetails;
CognitoIdentityServiceProvider.CognitoUserPool = Cognito.CognitoUserPool;
CognitoIdentityServiceProvider.CognitoUser = Cognito.CognitoUser;

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

  const responseFunctions = {
    onSuccess: result => {
      console.info('IT WORKED!');
      console.dir(result);
    },
    onFailure: err => {
      console.error('no go :(');
      console.dir(err);
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
};
