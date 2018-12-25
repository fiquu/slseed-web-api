const AWS = require('aws-sdk');

const profiles = require('../../../configs/profiles');
const package = require('../../../package.json');

module.exports = {
  AwsRegion: {
    Description: 'Instance AWS region',
    AllowedValues: [AWS.config.region],
    Default: AWS.config.region,
    Type: 'String'
  },
  Environment: {
    Description: 'Instance deployment environment',
    AllowedValues: Object.keys(profiles),
    Default: process.env.NODE_ENV,
    Type: 'String'
  },
  ProjectName: {
    Description: 'Instance group name',
    AllowedValues: [package.name],
    Default: package.name,
    Type: 'String'
  },
  ProjectTitle: {
    Description: 'Instance group title',
    AllowedValues: [package.title],
    Default: package.title,
    Type: 'String'
  }
};
