module.exports = {
  /**
   * Cognito Identity Pool Unauth IAM Role.
   */
  CognitoIdentityPoolUnauthRole: {
    Type: 'AWS::IAM::Role',
    DependsOn: ['CognitoIdentityPool'],
    Properties: {
      RoleName: {
        'Fn::Sub': 'cognito-${ProjectName}-${Environment}-unauth-role'
      },
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRoleWithWebIdentity',
            Effect: 'Allow',
            Principal: {
              Federated: 'cognito-identity.amazonaws.com'
            },
            Condition: {
              'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'unauthenticated'
              },
              StringEquals: {
                'cognito-identity.amazonaws.com:aud': {
                  Ref: 'CognitoIdentityPool'
                }
              }
            }
          }
        ]
      },
      Policies: [
        {
          PolicyName: {
            'Fn::Sub': 'cognito-${ProjectName}-${Environment}-unauth-default-role-policy'
          },
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
                Resource: ['*']
              }
            ]
          }
        }
      ]
    }
  },

  /**
   * Cognito Identity Pool Auth IAM Role.
   */
  CognitoIdentityPoolAuthRole: {
    Type: 'AWS::IAM::Role',
    DependsOn: ['CognitoIdentityPool'],
    Properties: {
      RoleName: {
        'Fn::Sub': 'cognito-${ProjectName}-${Environment}-auth-role'
      },
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRoleWithWebIdentity',
            Effect: 'Allow',
            Principal: {
              Federated: 'cognito-identity.amazonaws.com'
            },
            Condition: {
              'ForAnyValue:StringLike': {
                'cognito-identity.amazonaws.com:amr': 'authenticated'
              },
              StringEquals: {
                'cognito-identity.amazonaws.com:aud': {
                  Ref: 'CognitoIdentityPool'
                }
              }
            }
          }
        ]
      },
      Policies: [
        {
          PolicyName: {
            'Fn::Sub': 'cognito-${ProjectName}-${Environment}-auth-default-role-policy'
          },
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
                Resource: ['*']
              }
            ]
          }
        }
      ]
    }
  }
};
