import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

interface Params {
  limit: number;
  skip: number;
}

/**
 * Users resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {Array} The matched query results.
 */
export default async (parent: object, { skip = 0, limit = 50 }: Params, context: Context): Promise<object[]> => {
  const conn = await db.connect('default');

  await auth(context);

  const query = conn.model('user').find();

  if (skip > -1) {
    query.skip(skip);
  }

  if (limit > 0) {
    query.limit(limit);
  }

  return await query.lean();
};
