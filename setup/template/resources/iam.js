module.exports = {
  /**
   * Cognito Identity Pool Unauth IAM Role.
   */
  CognitoIdentityPoolUnauthRole: {
    Type: 'AWS::IAM::Role',
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
            Resource: ['*'],
            Effect: 'Allow'
          }
        ]
      },
      RoleName: {
        'Fn::Sub': 'cognito-${GroupName}-${Environment}-unauth-role'
      }
    }
  },

  /**
   * Cognito Identity Pool Auth IAM Role.
   */
  CognitoIdentityPoolAuthRole: {
    Type: 'AWS::IAM::Role',
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
            Resource: ['*'],
            Effect: 'Allow'
          }
        ]
      },
      RoleName: {
        'Fn::Sub': 'cognito-${GroupName}-${Environment}-auth-role'
      }
    }
  }
};
