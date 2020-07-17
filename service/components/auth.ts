import { APIGatewayProxyEvent as Context } from 'aws-lambda';
import op from 'object-path';
import is from '@fiquu/is';

import config, { UserType } from '../configs/auth';
import db from './database';

/**
 * Authorizes the request user if required.
 *
 * @param {Context} context The request event context.
 *
 * @returns {Promise<object>} A promise to the User data.
 *
 * @throws If there's no subject to authorize.
 * @throws If the provided subject has no data registered.
 */
export default async ({ requestContext }: Context): Promise<UserType> => {
  const sub = op.get<string>(requestContext, 'authorizer.claims.sub', '');

  if (is.empty(sub) || !is.string(sub)) {
    throw new Error('No auth subject provided');
  }

  const conn = await db.connect('default');

  const pipeline = config.get('pipeline');
  const model = config.get('model');

  const query = conn.model(model).aggregate<UserType>();

  query.match({ sub });

  if (is.array(pipeline) && !is.empty(pipeline)) {
    query.append(pipeline);
  }

  const [result] = await query;

  if (is.empty(result)) {
    throw new Error('No auth data found');
  }

  return result;
};
