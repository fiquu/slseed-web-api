module.exports = {
  region: 'us-east-1', // Default AWS region.
  profiles: {
    // These are the AWS profiles to use for each environment.
    // Add or change as you need.
    development: 'default',
    production: 'default',
    staging: 'default',
    testing: 'default',
    local: 'default'
  },
  apiVersions: {
    cloudformation: '2010-05-15',
    apiVersion: '2019-03-26',
    ssm: '2014-11-06',
    s3: '2006-03-01'
  }
};
