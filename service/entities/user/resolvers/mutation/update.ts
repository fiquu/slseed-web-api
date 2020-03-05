import { APIGatewayProxyEvent } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';
import { QueryUpdateOptions } from 'mongoose';

/**
 * User update resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (parent: any, params: any, context: APIGatewayProxyEvent): Promise<void> => {
  try {
    const conn = await db.connect('default');

    await auth(context);

    const User = conn.model('user');

    const conditions = {
      _id: params._id
    };

    const $set = {
      ...params
    };

    const options: QueryUpdateOptions = {
      runValidators: true
    };

    const { nModified } = await User.updateOne(conditions, { $set }, options);

    if (nModified !== 1) {
      throw 'No document modified.';
    }
  } catch (err) {
    throw new Error(err);
  }
};
