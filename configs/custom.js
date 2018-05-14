/**
 * Serverless custom configuration.
 *
 * @module configs/custom
 */

module.exports = {
  authorizer: {
    resultTtlInSeconds: 0, // TODO: Set this to an appropriate value
    name: 'authorizer',
    type: 'request'
  },
  customDomain: {
    certificateName: 'example.com',
    domainName: 'api.example.com',
    createRoute53Record: true,
    stage: '${opt:stage}',
    basePath: ''
  },
  'serverless-offline': {
    port: 8080
  }
};
