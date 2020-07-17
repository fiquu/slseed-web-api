import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import { UserDocument } from '../schema.types';

import { Pagination, getPagination } from '../../../components/pagination';
import db from '../../../components/database';
import auth from '../../../components/auth';

interface Params {
  pagination: Pagination;
}

/**
 * @param {object} root The GraphQL root.
 * @param {object} params The GraphQL query params.
 * @param params.pagination
 * @param {object} context The request context.
 * @returns {Array} The matched query results.
 */
export default async (root: unknown, { pagination }: Params, context: Context): Promise<Partial<UserDocument>> => {
  const { skip, limit } = getPagination(pagination);
  const conn = await db.connect('default');

  await auth(context);

  const query = conn.model<UserDocument>('user').find();

  query.skip(skip).limit(limit);

  return query.lean();
};
