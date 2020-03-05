import { ok, noContent } from '@fiquu/lambda-http-event-handler/lib/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createHTTPEvent } from '@fiquu/lambda-http-event-handler';
import { createLogger } from '@fiquu/logger';
import op from 'object-path';

import config from '../../configs/http-event';
import db from '../../components/database';

const log = createLogger('HTTP /api/my-path');

/**
 * Test handler function.
 *
 * @param {object} event The API Gateway request object.
 *
 * @returns {object} The API Gateway response object.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { res } = createHTTPEvent(event, config);

  const sub = op.get(event, 'requestContext.authorizer.claims.sub', null);

  if (!sub) {
    return noContent();
  }

  try {
    const conn = await db.connect('default');
    const user = await conn.model('user').findOne({ sub });

    return res.send(ok({
      body: user
    }));
  } catch (err) {
    log.error('Could not resolve session', { err });

    return res.handle(err);
  }
}
