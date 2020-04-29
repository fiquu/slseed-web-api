import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../components/database';
import auth from '../../../components/auth';

interface Params {
  _id: string;
}

/**
 * @param {object} root The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (root: object, { _id }: Params, context: Context) => {
  const conn = await db.connect('default');

  await auth(context);

  const query = conn.model('user').findById(_id);

  return query.lean();
};
