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
const api = require('./api');

module.exports = {
  Description: `${package.description} Stack [${process.env.NODE_ENV}]`,
  AWSTemplateFormatVersion: '2010-09-09',
  Resources: {
    ...database,
    ...cognito,
    ...mailer,
    ...public,
    ...api
  }
};
