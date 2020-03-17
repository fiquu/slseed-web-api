module.exports = {
  // Unauthorized
  GatewayResponse: {
    Type: 'AWS::ApiGateway::GatewayResponse',
    Properties: {
      ResponseType: 'EXPIRED_TOKEN',
      StatusCode: 401,
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Headers': '\'*\'',
        'gatewayresponse.header.Access-Control-Allow-Origin': '\'*\''
      },
      RestApiId: {
        Ref: 'ApiGatewayRestApi'
      }
    }
  },

  // Forbidden
  AuthFailureGatewayResponse: {
    Type: 'AWS::ApiGateway::GatewayResponse',
    Properties: {
      ResponseType: 'UNAUTHORIZED',
      StatusCode: 403,
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Headers': '\'*\'',
        'gatewayresponse.header.Access-Control-Allow-Origin': '\'*\''
      },
      RestApiId: {
        Ref: 'ApiGatewayRestApi'
      }
    }
  }
};
