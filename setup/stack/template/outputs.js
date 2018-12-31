module.exports = {
  CognitoIdentityPoolId: {
    Description: 'Cognito Identity Pool Id',
    Value: {
      Ref: 'CognitoIdentityPool'
    },
    Export: {
      Name: {
        'Fn::Sub': '${AWS::StackName}:cognito-identity-pool-id'
      }
    }
  },

  CognitoUserPoolId: {
    Description: 'Cognito User Pool Id',
    Value: {
      Ref: 'CognitoUserPool'
    },
    Export: {
      Name: {
        'Fn::Sub': '${AWS::StackName}:cognito-user-pool-id'
      }
    }
  },

  CognitoUserPoolClientId: {
    Description: 'Cognito User Pool Client Id',
    Value: {
      Ref: 'CognitoUserPoolClient'
    },
    Export: {
      Name: {
        'Fn::Sub': '${AWS::StackName}:cognito-user-pool-client-id'
      }
    }
  }
};
