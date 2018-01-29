/**
 * Serverless custom configuration.
 *
 * @module configs/custom
 */

module.exports = {
  authorizer: {
    resultTtlInSeconds: 0,
    name: 'authorizer',
    type: 'request'
  },
  customDomain: {
    domainName: 'api.example.com',
    certificateName: '*.api.example.com',
    stage: '${opt:stage}',
    createRoute53Record: true,
    basePath: ''
  },
  'serverless-offline': {
    port: 8080
  }
};
