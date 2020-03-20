import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

interface Params {
  _id: string;
}

/**
 * User resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (parent: object, { _id }: Params, context: Context): Promise<object> => {
  const conn = await db.connect('default');

  await auth(context);

  const query = conn.model('user').findById(_id);

  return await query.lean();
};
