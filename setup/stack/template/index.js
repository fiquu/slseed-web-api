const { title, group } = require('../../../package.json');

const Parameters = require('./parameters');
const Resources = require('./resources');

module.exports = {
  Description: `${group.title} ${title} Base Stack [${process.env.NODE_ENV}]`,
  AWSTemplateFormatVersion: '2010-09-09',
  Parameters,
  Resources
};
