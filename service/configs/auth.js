/**
 * Auth Config module.
 *
 * @module configs/auth
 */

if (!process.env.COGNITO_USER_POOL_ID) {
  throw new Error('Environment variable [COGNITO_USER_POOL_ID] is not set!');
}

module.exports = {
  issuer: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
  model: 'user', // The model to resolve data from
  pipeline: [] // Mongo aggregate pipeline to resolve additional data
};
