/**
 * Main Stack Template.
 *
 * @module setup/template
 */

const AWS = require('aws-sdk');

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
      Name: `/${package.group.name}/${process.env.NODE_ENV}/db-uri`,
      Description: `${package.group.title} Database URI [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: values.dbUri
    }
  };

  // Mailer API Key SSM Parameter
  Template.Resources.MailerApiKeyParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/mailer-api-key`,
      Description: `${package.group.title} Mailer API Key [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: values.mailerApiKey
    }
  };

  // Mailer Sender SSM Parameter
  Template.Resources.MailerSenderParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/mailer-sender`,
      Description: `${package.group.title} Mailer Sender [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: values.mailerSender
    }
  };

  // Mailer Domain SSM Parameter
  Template.Resources.MailerDomainParam = {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/mailer-domain`,
      Description: `${package.group.title} Mailer Domain [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: values.mailerDomain
    }
  };

  // Cognito User Pool
  Template.Resources.CognitoUserPool = {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
      UserPoolName: `${process.env.NODE_ENV}-${package.group.name}`,
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email'],
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true
      },
      Policies: {
        PasswordPolicy: {
          MinimumLength: 10,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireSymbols: false,
          RequireUppercase: false
        }
      },
      Schema: [
        {
          AttributeDataType: 'String',
          Name: 'email',
          Required: true
        }
      ]
    }
  };

  // Cognito User Pool Client
  Template.Resources.CognitoUserPoolClient = {
    Type: 'AWS::Cognito::UserPoolClient',
    DependsOn: ['CognitoUserPool'],
    Properties: {
      ClientName: `${process.env.NODE_ENV}-${package.group.name}`,
      ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
      GenerateSecret: false,
      UserPoolId: {
        Ref: 'CognitoUserPool'
      }
    }
  };

  // Cognito Identity Pool
  Template.Resources.CognitoIdentityPool = {
    Type: 'AWS::Cognito::IdentityPool',
    DependsOn: ['CognitoUserPool', 'CognitoUserPoolClient'],
    Properties: {
      IdentityPoolName: `${process.env.NODE_ENV} ${package.group.name}`,
      AllowUnauthenticatedIdentities: false,
      CognitoIdentityProviders: [
        {
          ProviderName: {
            'Fn::Join': [
              '',
              [
                'cognito-idp.',
                AWS.config.region,
                '.amazonaws.com/',
                {
                  Ref: 'CognitoUserPool'
                }
              ]
            ]
          },
          ClientId: {
            Ref: 'CognitoUserPoolClient'
          }
        }
      ]
    }
  };

  // Cognito User Pool Id SSM Parameter
  Template.Resources.CognitoUserPoolIdParam = {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoUserPool'],
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/cognito-user-pool-id`,
      Description: `${package.group.title} Cognito User Pool Id [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: {
        Ref: 'CognitoUserPool'
      }
    }
  };

  // Cognito User Pool ARN SSM Parameter
  Template.Resources.CognitoUserPoolArnParam = {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoUserPool'],
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/cognito-user-pool-arn`,
      Description: `${package.group.title} Cognito User Pool ARN [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: {
        'Fn::GetAtt': ['CognitoUserPool', 'Arn']
      }
    }
  };

  // Cognito User Pool Client Id SSM Parameter
  Template.Resources.CognitoUserPoolClientParam = {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoUserPoolClient'],
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/cognito-user-pool-client-id`,
      Description: `${package.group.title} Cognito User Pool Client Id [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: {
        Ref: 'CognitoUserPoolClient'
      }
    }
  };

  // Cognito Identity Pool Id SSM Parameter
  Template.Resources.CognitoIdentityPoolParam = {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoIdentityPool'],
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/cognito-identity-pool-id`,
      Description: `${package.group.title} Cognito Identity Pool Id [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: {
        Ref: 'CognitoIdentityPool'
      }
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
