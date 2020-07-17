import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import { UserDocument } from '../schema.types';

import db from '../../../components/database';
import auth from '../../../components/auth';

interface Params {
  _id: string;
  input: {
    name: string;
  };
}

/**
 * @param {object} root The GraphQL root.
 * @param {object} params The GraphQL query params.
 * @param {string} params._id The ID to update by.
 * @param {string} params.input The input data to update with.
 * @param {object} context The request context.
 *
 * @returns {object} The updated user.
 */
export default async (root: unknown, { _id, input }: Params, context: Context): Promise<UserDocument> => {
  const conn = await db.connect('default');

  await auth(context);

  await conn.model<UserDocument>('user').updateOne({
    _id
  }, {
    $set: {
      ...input
    }
  }, {
    runValidators: true
  }).orFail();

  return conn.model<UserDocument>('user').findById(_id).lean();
};
