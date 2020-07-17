import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../components/database';
import auth from '../../../components/auth';
import { UserDocument } from '../schema.types';

interface Params {
  _id: string;
}

/**
 * @param {object} root The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {string} params._id The ID to find by.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (root: unknown, { _id }: Params, context: Context): Promise<UserDocument> => {
  const conn = await db.connect('default');

  await auth(context);

  const query = conn.model<UserDocument>('user').findById(_id);

  return query.lean();
};
