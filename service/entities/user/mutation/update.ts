import { APIGatewayProxyEvent as Context } from 'aws-lambda';

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
 * @param {object} context The request context.
 *
 * @returns {object} The updated user.
 */
export default async (root: object, { _id, input }: Params, context: Context) => {
  const conn = await db.connect('default');

  await auth(context);

  const { nModified } = await conn.model('user').updateOne({
    _id
  }, {
    $set: { ...input }
  }, {
    runValidators: true
  });

  if (nModified !== 1) {
    throw Error('ERR_NONE_MODIFIED');
  }

  return conn.model('user').findById(_id).lean();
};
