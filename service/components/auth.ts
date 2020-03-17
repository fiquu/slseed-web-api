import { APIGatewayProxyEvent } from 'aws-lambda';
import op from 'object-path';

import db from './database';

import config from '../configs/auth';

/**
 * Authorizes the request user if required.
 *
 * @param {APIGatewayProxyEvent} context The request event context.
 *
 * @returns {object|null} The user data or null if not required and no subject
 * is present.
 *
 * @throws ERR_NO_AUTH_SUBJECT If there's no subject to authorize.
 * @throws ERR_NO_AUTH_DATA If the provided subject has no data registered.
 */
export default async (context: APIGatewayProxyEvent): Promise<any> => {
  const sub = op.get(context, 'requestContext.authorizer.claims.sub', null);
  const conn = await db.connect('default');

  if (typeof sub !== 'string' || sub.length < 1) {
    throw 'ERR_NO_AUTH_SUBJECT';
  }

  const pipeline = config.get('pipeline');
  const model = config.get('model');

  const query = conn.model(model).aggregate();

  query.match({ sub });

  if (Array.isArray(pipeline) && pipeline.length > 0) {
    query.append(pipeline);
  }

  const [result] = await query;

  if (!result || !result._id) {
    throw 'ERR_NO_AUTH_DATA_FOUND';
  }

  return result;
};
