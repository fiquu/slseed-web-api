/**
 * Serverless custom configuration.
 *
 * @module configs/custom
 */

module.exports = {
  package: '${file(./package.json)}',
  authorizer: {
    arn: '${ssm:/${self:custom.package.group.name}/${self:provider.stage}/auth-cognito-user-pool-arn~true}'
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
