/**
 * Auth Component module.
 *
 * @module components/auth
 */

const jwkToPem = require('jwk-to-pem');
const jwk = require('jsonwebtoken');
const request = require('request');

const config = require('../configs/auth');

/**
 * Generate policy to allow a user on an API.
 *
 * @param {String} principalId The principal ID.
 * @param {String} Effect The statement Effect value.
 * @param {String} Resource The statement Resource value.
 *
 * @returns {Object} The authorization policy object.
 */
function generatePolicy(principalId, Effect, Resource, context) {
  const authResponse = {
    principalId,
    context
  };

  if (Effect && Resource) {
    authResponse.policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Resource,
          Effect
        }
      ]
    };
  }

  return authResponse;
}

/**
 * Generates a valid authorization request options object.
 *
 * @return {Object} Authorization request object.
 */
function getRequestOptions() {
  return {
    url: `${config.issuer}/.well-known/jwks.json`,
    json: true
  };
}

/**
 * Generates a valid PEM from JWKS keys.
 *
 * @returns {Object} The PEM object.
 */
function generatePemFromKeys(body) {
  if (!body || !body.keys || body.keys.length < 1) {
    console.error(body);
    return null;
  }

  const [key] = body.keys;

  return jwkToPem({
    kty: key.kty,
    n: key.n,
    e: key.e
  });
}

/**
 * Authorizes a Cognito user.
 *
 * @param {String} authorizationToken The authorization JWT.
 *
 * @returns {Promise} The authorization promise resolving the auth policy.
 */
function authorize(authorizationToken) {
  return new Promise((resolve, reject) => {
    request(getRequestOptions(), (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      const pem = generatePemFromKeys(body);

      if (!pem) {
        reject(new Error("Couldn't generate PEM"));
        return;
      }

      const options = {
        issuer: config.issuer
      };

      jwk.verify(authorizationToken, pem, options, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(decoded);
      });
    });
  });
}

module.exports = {
  generatePemFromKeys,
  getRequestOptions,
  generatePolicy,
  authorize
};
