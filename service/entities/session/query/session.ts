import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import auth from '../../../components/auth';

/**
 * @param {object} root The GraphQL root.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The result.
 */
export default async (root: object, params: object, context: Context) => {
  return auth(context);
};
