/**
 * Main Stack Mailer Template.
 *
 * @module setup/template/mailer
 */

const package = require('../../package.json');

module.exports = {
  // Mailer API Key SSM Parameter
  MailerApiKeyParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/mailer-api-key`,
      Description: `${package.group.title} Mailer API Key [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: ''
    }
  },

  // Mailer Sender SSM Parameter
  MailerSenderParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/mailer-sender`,
      Description: `${package.group.title} Mailer Sender [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: ''
    }
  },

  // Mailer Domain SSM Parameter
  MailerDomainParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/mailer-domain`,
      Description: `${package.group.title} Mailer Domain [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: ''
    }
  }
};
