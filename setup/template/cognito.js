/**
 * Main Stack Cognito Template.
 *
 * @module setup/template/cognito
 */

const AWS = require('aws-sdk');

const package = require('../../package.json');

module.exports = () => ({
  // Cognito User Pool
  CognitoUserPool: {
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
  },

  // Cognito User Pool Client
  CognitoUserPoolClient: {
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
  },

  // Cognito Identity Pool
  CognitoIdentityPool: {
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
  },

  // Cognito User Pool Id SSM Parameter
  CognitoUserPoolIdParam: {
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
  },

  // Cognito User Pool ARN SSM Parameter
  CognitoUserPoolArnParam: {
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
  },

  // Cognito User Pool Client Id SSM Parameter
  CognitoUserPoolClientParam: {
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
  },

  // Cognito Identity Pool Id SSM Parameter
  CognitoIdentityPoolParam: {
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
  }
});
