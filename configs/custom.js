/**
 * Serverless custom configuration.
 *
 * @module configs/custom
 */

module.exports = {
  package: '${file(./package.json)}',
  authorizer: {
    arn: '${env:COGNITO_USER_POOL_ARN}'
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
