/**
 * Cognito create handler.
 *
 * @module tests/cognito/create
 */

const { SSM, CognitoIdentityServiceProvider } = require('aws-sdk');
const fs = require('fs');

const package = require('../../package.json');

module.exports = async () => {
  const credentials = {
    Username: `${package.name}-test@mailinator.com`,
    Password: `${package.name}-test-temp-password`
  };

  // Resolve App client ID
  await new Promise((resolve, reject) => {
    const ssm = new SSM();

    const mappings = {
      [`/${package.group.name}/${process.env.NODE_ENV}/cognito-app-client-id`]: 'COGNITO_APP_CLIENT_ID'
    };

    const params = {
      Names: Object.keys(mappings),
      WithDecryption: true
    };

    ssm.getParameters(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // Map SSM parameters to env vars
      for (let param of data.Parameters) {
        if (mappings[param.Name]) {
          process.env[mappings[param.Name]] = param.Value;
        }
      }

      resolve();
    });
  });

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
