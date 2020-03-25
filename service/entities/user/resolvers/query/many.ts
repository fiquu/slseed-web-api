import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

type Result = Promise<object[]>;

interface Params {
  pagination: {
    limit: number;
    skip: number;
  };
}

/**
 * Users resolver function.
 *
 * @param {object} root The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {Array} The matched query results.
 */
export default async (root: object, { pagination }: Params, context: Context): Result => {
  const { skip = 0, limit = 50 } = pagination || {};

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
