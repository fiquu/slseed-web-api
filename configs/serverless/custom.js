module.exports = {
  package: '${file(./package.json)}',
  cors: true,
  authorizer: {
    arn: '${env:COGNITO_USER_POOL_ARN}'
  },
  'serverless-offline': {
    lambdaPort: 8082,
    httpPort: 8080
  },
  prune: {
    automatic: true,
    number: 2
  }
};
