module.exports = {
  issuer: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.SLSEED_COGNITO_INSTANCE1_USER_POOL_ID}`,
  model: 'user', // The model to resolve data from
  pipeline: [] // Mongo aggregate pipeline to resolve additional data
};
