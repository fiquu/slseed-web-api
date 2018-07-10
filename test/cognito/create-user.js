/**
 * Cognito create handler.
 *
 * @module tests/cognito/create
 */

const { CognitoIdentityServiceProvider } = require('aws-sdk');
const fs = require('fs');

const ssmr = require('../../utils/ssm-params-resolve');
const package = require('../../package.json');

module.exports = async () => {
  const credentials = {
    Username: `${package.name}-test@mailinator.com`,
    Password: `${package.name}-test-temp-password`
  };

  // Resolve Cognito App Client ID and set it as ENV var
  await ssmr(['cognito-app-client-id'], true);

  const data = await new Promise((resolve, reject) => {
    const cognito = new CognitoIdentityServiceProvider();

    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      TemporaryPassword: credentials.Password,
      Username: credentials.Username,
      DesiredDeliveryMediums: ['EMAIL'],
      ForceAliasCreation: false,
      UserAttributes: [
        {
          Name: 'name',
          Value: `${package.group.title} Tester`
        },
        {
          Name: 'email',
          Value: `${package.name}-test@mailinator.com`
        },
        {
          Name: 'email_verified',
          Value: 'True'
        }
      ]
    };

    cognito.adminCreateUser(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });

  await new Promise((resolve, reject) => {
    const json = JSON.stringify({
      Password: credentials.Password,
      ...data
    });

    fs.writeFile(`${__dirname}/data.json`, json, err => {
      err ? reject(err) : resolve();
    });
  });

  return credentials;
};
