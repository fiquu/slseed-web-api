/**
 * Main Stack Template.
 *
 * @module setup/template
 */

const package = require('../../package.json');

const database = require('./database');
const cognito = require('./cognito');
const mailer = require('./mailer');
const public = require('./public');

module.exports = values => ({
  Description: `${package.description} Stack [${process.env.NODE_ENV}]`,
  AWSTemplateFormatVersion: '2010-09-09',
  Resources: {
    ...database(values),
    ...cognito(values),
    ...mailer(values),
    ...public(values)
  }
});
