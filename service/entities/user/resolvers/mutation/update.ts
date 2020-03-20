import { APIGatewayProxyEvent as Context } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';
import { QueryUpdateOptions } from 'mongoose';

interface Params {
  _id: string;
  [key: string]: string;
}

/**
 * User update resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (parent: object, params: Params, context: Context): Promise<object> => {
  const conn = await db.connect('default');

  await auth(context);

  const conditions = {
    _id: params._id
  };

  const $set = {
    ...params
  };

  const options: QueryUpdateOptions = {
    runValidators: true
  };

  const { nModified } = await conn.model('user').updateOne({ ...conditions }, { $set }, options);

  if (nModified !== 1) {
    throw Error('ERR_NONE_MODIFIED');
  }

  return conn.model('user').findById(params._id);
};
