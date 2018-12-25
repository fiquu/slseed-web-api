module.exports = {
  /**
   * Cognito User Pool.
   */
  CognitoUserPool: {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email'],
      UserPoolName: {
        'Fn::Sub': '${ProjectName}-${Environment}'
      },
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

  /**
   * Cognito User Pool Client.
   */
  CognitoUserPoolClient: {
    Type: 'AWS::Cognito::UserPoolClient',
    DependsOn: ['CognitoUserPool'],
    Properties: {
      ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
      GenerateSecret: false,
      ClientName: {
        'Fn::Sub': '${ProjectName}-${Environment}-app-client'
      },
      UserPoolId: {
        Ref: 'CognitoUserPool'
      }
    }
  },

  /**
   * Cognito Identity Pool.
   */
  CognitoIdentityPool: {
    Type: 'AWS::Cognito::IdentityPool',
    DependsOn: ['CognitoUserPool', 'CognitoUserPoolClient'],
    Properties: {
      AllowUnauthenticatedIdentities: false,
      IdentityPoolName: {
        'Fn::Sub': '${ProjectName} ${Environment}'
      },
      CognitoIdentityProviders: [
        {
          ProviderName: {
            'Fn::Sub': 'cognito-idp.${AwsRegion}.amazonaws.com/${CognitoUserPool}'
          },
          ClientId: {
            Ref: 'CognitoUserPoolClient'
          }
        }
      ]
    }
  },

  /**
   * Cognito Identity Pool IAM Roles Attachment.
   *
   * @see iam.js
   */
  CognitoIdentityPoolRolesAttachment: {
    Type: 'AWS::Cognito::IdentityPoolRoleAttachment',
    DependsOn: ['CognitoIdentityPool', 'CognitoIdentityPoolUnauthRole', 'CognitoIdentityPoolAuthRole'],
    Properties: {
      IdentityPoolId: {
        Ref: 'CognitoIdentityPool'
      },
      Roles: {
        unauthenticated: {
          'Fn::GetAtt': ['CognitoIdentityPoolUnauthRole', 'Arn']
        },
        authenticated: {
          'Fn::GetAtt': ['CognitoIdentityPoolAuthRole', 'Arn']
        }
      }
    }
  },

  /**
   * Cognito User Pool Id SSM Parameter.
   */
  CognitoUserPoolIdParam: {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoUserPool'],
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/cognito-user-pool-id'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Cognito User Pool Id [${Environment}]'
      },
      Value: {
        Ref: 'CognitoUserPool'
      }
    }
  },

  /**
   * Cognito User Pool ARN SSM Parameter.
   */
  CognitoUserPoolArnParam: {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoUserPool'],
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/cognito-user-pool-arn'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Cognito User Pool ARN [${Environment}]'
      },
      Value: {
        'Fn::GetAtt': ['CognitoUserPool', 'Arn']
      }
    }
  },

  /**
   * Cognito User Pool Client Id SSM Parameter.
   */
  CognitoUserPoolClientParam: {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoUserPoolClient'],
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/cognito-user-pool-client-id'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Cognito User Pool Client Id [${Environment}]'
      },
      Value: {
        Ref: 'CognitoUserPoolClient'
      }
    }
  },

  /**
   * Cognito Identity Pool Id SSM Parameter.
   */
  CognitoIdentityPoolParam: {
    Type: 'AWS::SSM::Parameter',
    DependsOn: ['CognitoIdentityPool'],
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/cognito-identity-pool-id'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Cognito Identity Pool Id [${Environment}]'
      },
      Value: {
        Ref: 'CognitoIdentityPool'
      }
    }
  }
};
