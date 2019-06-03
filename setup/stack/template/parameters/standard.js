const AWS = require('aws-sdk');

const { profiles } = require('../../../../configs/aws');
const { name, title } = require('../../../../package.json');

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
  ProjectNameClean: {
    Description: 'Instance group name',
    AllowedValues: [name.replace(/\W+/gi, ' ').replace(/\s+/, ' ')],
    Default: name.replace(/\W+/gi, ' ').replace(/\s+/, ' '),
    Type: 'String'
  },
  ProjectName: {
    Description: 'Instance group name',
    AllowedValues: [name],
    Default: name,
    Type: 'String'
  },
  ProjectTitle: {
    Description: 'Instance group title',
    AllowedValues: [title],
    Default: title,
    Type: 'String'
  }
};
