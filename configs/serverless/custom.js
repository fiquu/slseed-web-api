module.exports = {
  package: '${file(./package.json)}',
  cors: true,
  authorizer: {
    arn: '${env:COGNITO_USER_POOL_ARN}'
  },
  'serverless-offline': {
    lambdaPort: (process.env.PORT || 8080) + 2,
    httpPort: process.env.PORT || 8080
  },
  prune: {
    automatic: true,
    number: 2
  }
};
