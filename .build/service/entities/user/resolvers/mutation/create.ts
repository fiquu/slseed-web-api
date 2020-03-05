import { APIGatewayProxyEvent } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

/**
 * User create resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
export default async (parent: any, params: any, context: APIGatewayProxyEvent): Promise<any> => {
  try {
    const conn = await db.connect('default');

    await auth(context);

    const User = conn.model('user');
    const result = User.create({ ...params });

    return result;
  } catch (err) {
    throw new Error(err);
  }
};
