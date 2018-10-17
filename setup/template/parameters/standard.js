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
  GroupName: {
    Description: 'Instance group name',
    AllowedValues: [package.group.name],
    Default: package.group.name,
    Type: 'String'
  },
  GroupTitle: {
    Description: 'Instance group title',
    AllowedValues: [package.group.title],
    Default: package.group.title,
    Type: 'String'
  }
};
