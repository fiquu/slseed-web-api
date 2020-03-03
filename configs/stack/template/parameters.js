const slug = require('url-slug');

const { name, title } = require('../../../package.json');
const { profiles } = require('../../../configs/aws');
const { region } = require('../../aws');

const nameClean = name.replace(/\W+/g, ' ').replace(/\s+/g, ' ').trim();
const nameSlug = slug(name);

module.exports = {
  AwsRegion: {
    Description: 'Project AWS region',
    AllowedValues: [region],
    Default: region,
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
  }
};
