import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

export type EventParams = Partial<APIGatewayProxyEvent>;

/**
 * @param {string} sub The user subject.
 *
 * @returns {object} The request context.
 */
export function getRequestContext(sub): APIGatewayProxyEvent['requestContext'] {
  return {
    requestTimeEpoch: Date.now(),
    resourceId: '',
    resourcePath: '/',
    stage: process.env.NODE_ENV,
    httpMethod: 'POST',
    protocol: 'http',
    accountId: uuid(),
    identity: null,
    apiId: uuid(),
    path: '/',
    requestId: uuid(),
    authorizer: {
      claims: {
        sub
      }
    }
  };
}

/**
 * @param {string} sub The user subject.
 * @param {object} params The parameters to override.
 *
 * @returns {object} The created event.
 */
export function getEvent(sub?: string, params?: EventParams): APIGatewayProxyEvent {
  return {
    requestContext: getRequestContext(sub),
    multiValueQueryStringParameters: null,
    queryStringParameters: null,
    multiValueHeaders: null,
    isBase64Encoded: false,
    pathParameters: null,
    stageVariables: null,
    httpMethod: 'POST',
    resource: null,
    headers: {},
    path: '/',
    body: '',
    ...(params || {})
  };
}
