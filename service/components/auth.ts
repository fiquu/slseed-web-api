import { APIGatewayProxyEvent as Context } from 'aws-lambda';
import op from 'object-path';
import is from '@fiquu/is';

import { UserDocument } from '../entities/user/schema.db';
import config from '../configs/auth';
import db from './database';

/**
 * Authorizes the request user if required.
 *
 * @param {Context} context The request event context.
 *
 * @returns {Promise<object>} A promise to the User data.
 *
 * @throws ERR_NO_AUTH_SUBJECT If there's no subject to authorize.
 * @throws ERR_NO_AUTH_DATA If the provided subject has no data registered.
 */
export default async ({ requestContext }: Context) => {
  const sub = op.get(requestContext, 'authorizer.claims.sub', '');

  if (is.empty(sub) || !is.string(sub)) {
    throw new Error('ERR_NO_AUTH_SUBJECT');
  }

  const conn = await db.connect('default');

  const pipeline = config.get('pipeline');
  const model = config.get('model');

  const query = conn.model(model).aggregate();

  query.match({ sub });

  if (Array.isArray(pipeline) && pipeline.length > 0) {
    query.append(pipeline);
  }

  const [result] = await query;

  if (is.empty(result)) {
    throw new Error('ERR_NO_AUTH_DATA_FOUND');
  }

  return result as UserDocument;
};
