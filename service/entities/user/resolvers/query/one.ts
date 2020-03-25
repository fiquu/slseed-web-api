import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

type Result = Promise<object>;

interface Params {
  _id: string;
}

/**
 * User resolver function.
 *
 * @param {object} root The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (root: object, { _id }: Params, context: Context): Result => {
  const conn = await db.connect('default');

  await auth(context);

  const query = conn.model('user').findById(_id);

  return await query.lean();
};
