import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

type Params = Record<string, string>;

/**
 * User create resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (parent: object, params: Params, context: Context): Promise<object> => {
  const conn = await db.connect('default');

  await auth(context);

  return await conn.model('user').create({
    ...params
  });
};
