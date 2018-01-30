/**
 * Serverless custom configuration.
 *
 * @module configs/custom
 */

module.exports = {
  authorizer: {
    resultTtlInSeconds: 0,
    name: 'authorizer',
    type: 'REQUEST'
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
