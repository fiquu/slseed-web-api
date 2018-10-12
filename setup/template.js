/**
 * Main Stack Template.
 *
 * @module setup/template
 */

const package = require('../package.json');

module.exports = values => {
  const Template = {
    Description: `${package.description} Stack [${process.env.NODE_ENV}]`,
    AWSTemplateFormatVersion: '2010-09-09',
    Resources: {}
  };

  // Database URI SSM Parameter
  Template.Resources.DatabaseUriParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Description: `${package.group.title} Database URI [${process.env.NODE_ENV}]`,
      Type: 'String',
      Name: 'db-uri',
      Value: values.dbUri
    }
  };

  // Mailer API Key SSM Parameter
  Template.Resources.MailerApiKeyParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Description: `${package.group.title} Mailer API Key [${process.env.NODE_ENV}]`,
      Type: 'String',
      Name: 'mailer-api-key',
      Value: values.mailerApiKey
    }
  };

  // Mailer Sender SSM Parameter
  Template.Resources.MailerSenderParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Description: `${package.group.title} Mailer Sender [${process.env.NODE_ENV}]`,
      Type: 'String',
      Name: 'mailer-sender',
      Value: values.mailerSender
    }
  };

  // Mailer Domain SSM Parameter
  Template.Resources.MailerDomainParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Description: `${package.group.title} Mailer Domain [${process.env.NODE_ENV}]`,
      Type: 'String',
      Name: 'mailer-domain',
      Value: values.mailerDomain
    }
  };

  // Public Assets S3 Bucket
  Template.Resources.PublicAssetsBucket = {
    Type: 'AWS::S3::Bucket'
  };

  // Public Assets CloudFront Origin Access Identity
  Template.Resources.PublicAssetsBucketAccess = {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: `${package.group.title} Public Assets Access Origin Identity [${process.env.NODE_ENV}]`
      }
    }
  };

  // Public Assets CloudFront Distribution
  Template.Resources.PublicAssetsDist = {
    Type: 'AWS::CloudFront::Distribution',
    DependsOn: ['PublicAssetsBucket', 'PublicAssetsBucketAccess'],
    Properties: {
      DistributionConfig: {
        Comment: `${package.group.title} Public Assets [${process.env.NODE_ENV}]`,
        PriceClass: 'PriceClass_All',
        Enabled: true,
        Origins: [
          {
            DomainName: {
              'Fn::GetAtt': ['PublicAssetsBucket', 'DomainName']
            },
            Id: {
              Ref: 'PublicAssetsBucket'
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Sub': 'origin-access-identity/cloudfront/${PublicAssetsBucketAccess}'
              }
            }
          }
        ],
        DefaultCacheBehavior: {
          ViewerProtocolPolicy: 'redirect-to-https',
          Compress: true,
          ForwardedValues: {
            QueryString: false
          },
          TargetOriginId: {
            Ref: 'PublicAssetsBucket'
          }
        }
      }
    }
  };

  return Template;
};
