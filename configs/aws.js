/**
 * AWS config.
 *
 * @module configs/aws
 */

module.exports = {
  region: 'us-east-1' /* Default AWS region */,
  profiles: {
    /* This are the AWS profiles to use for each stage */
    development: 'unapega-development',
    production: 'unapega-production',
    staging: 'unapega-staging',
    local: 'unapega-local'
  },
  apiVersions: {
    ssm: '2014-11-06',
    s3: '2006-03-01'
  }
};
