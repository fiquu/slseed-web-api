import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import auth from '../../../../components/auth';

/**
 * Get Room Token resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The response.
 */
export default async (parent: object, params: object, context: Context): Promise<object> => {
  return await auth(context);
};
