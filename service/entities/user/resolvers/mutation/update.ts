import { APIGatewayProxyEvent as Context } from 'aws-lambda';
import { QueryUpdateOptions } from 'mongoose';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

interface Params {
  _id: string;
  input: {
    name: string;
  };
}

/**
 * User update resolver function.
 *
 * @param {object} root The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (root: object, { _id, input }: Params, context: Context): Promise<object> => {
  const conn = await db.connect('default');

  await auth(context);

  const $set = {
    ...input
  };

  const options: QueryUpdateOptions = {
    runValidators: true
  };

  const { nModified } = await conn.model('user').updateOne({ _id }, { $set }, options);

  if (nModified !== 1) {
    throw Error('ERR_NONE_MODIFIED');
  }

  return conn.model('user').findById(_id).lean();
};
