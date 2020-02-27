const AWS = require('aws-sdk');

const { name, title, group } = require('../../../package.json');
const { profiles } = require('../../../configs/aws');
const nameClean = name.replace(/\W+/g, ' ').replace(/\s+/g, ' ').trim();
const nameSlug = name.replace(/\W+/g, ' ').trim().replace(/\s+/g, '-');

module.exports = {
  AwsRegion: {
    Description: 'Project AWS region',
    AllowedValues: [AWS.config.region],
    Default: AWS.config.region,
    Type: 'String'
  },
  Environment: {
    Description: 'Project deployment environment',
    AllowedValues: Object.keys(profiles),
    Default: process.env.NODE_ENV,
    Type: 'String'
  },
  ProjectName: {
    Description: 'Project Name',
    AllowedValues: [nameSlug],
    Default: nameSlug,
    Type: 'String'
  },
  ProjectNameClean: {
    Description: 'Project Name Clean',
    AllowedValues: [nameClean],
    Default: nameClean,
    Type: 'String'
  },
  ProjectTitle: {
    Description: 'Project Title',
    AllowedValues: [title],
    Default: title,
    Type: 'String'
  },
  GroupName: {
    Description: 'Project Group Name',
    AllowedValues: [group.name],
    Default: group.name,
    Type: 'String'
  },
  GroupTitle: {
    Description: 'Project Group Title',
    AllowedValues: [group.title],
    Default: group.title,
    Type: 'String'
  }
};
