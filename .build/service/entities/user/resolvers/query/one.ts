import { APIGatewayProxyEvent } from 'aws-lambda';

import db from '../../../../components/database';
import auth from '../../../../components/auth';

/**
 * Labels resolver function.
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
    const query = User.findOne()
      .where('_id').equals(params._id)
      .select({
        sub: true
      });

    const result = await query;

    return result;
  } catch (err) {
    throw new Error(err);
  }
};
