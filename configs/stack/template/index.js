const { title } = require('../../../package.json');

const Parameters = require('./parameters');
const Resources = require('./resources');
const Outputs = require('./outputs');

module.exports = {
  Description: `${title} Base Stack [${process.env.NODE_ENV}]`,
  AWSTemplateFormatVersion: '2010-09-09',
  Parameters,
  Resources,
  Outputs
};
