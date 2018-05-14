/**
 * Serverless resources configuration.
 *
 * @module configs/resources
 */

module.exports = {
  Resources: {
    // Responses needed for auth CORS
    GatewayResponse: {
      Type: 'AWS::ApiGateway::GatewayResponse',
      Properties: {
        ResponseParameters: {
          'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          'gatewayresponse.header.Access-Control-Allow-Origin': "'*'"
        },
        ResponseType: 'EXPIRED_TOKEN',
        RestApiId: {
          Ref: 'ApiGatewayRestApi'
        },
        StatusCode: 401
      }
    },
    AuthFailureGatewayResponse: {
      Type: 'AWS::ApiGateway::GatewayResponse',
      Properties: {
        ResponseParameters: {
          'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          'gatewayresponse.header.Access-Control-Allow-Origin': "'*'"
        },
        ResponseType: 'UNAUTHORIZED',
        RestApiId: {
          Ref: 'ApiGatewayRestApi'
        },
        StatusCode: 403
      }
    }
  }
};
