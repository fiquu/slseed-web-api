import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import auth from '../../../../components/auth';

type Result = Promise<object>;

/**
 * Session resolver function.
 *
 * @param {object} root The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The response.
 */
export default async (root: object, params: object, context: Context): Result => {
  return await auth(context);
};
