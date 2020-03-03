import { APIGatewayProxyEvent } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

/**
 * Users resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {Array} The matched query results.
 */
export default async (parent: any, params: any, context: APIGatewayProxyEvent): Promise<any> => {
  try {
    const conn = await db.connect('default');

    await auth(context);

    const User = conn.model('label');
    const query = User.find();

    if (params.skip) {
      query.skip(params.skip);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    const results = await query;

    return results;
  } catch (err) {
    throw new Error(err);
  }
};
