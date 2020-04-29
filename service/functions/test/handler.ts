import { noContent } from '@fiquu/lambda-http-event-handler/lib/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createHTTPEvent } from '@fiquu/lambda-http-event-handler';
import { createLogger } from '@fiquu/logger';

import config from '../../configs/http-event';

const log = createLogger('functions/test');

/**
 * Test handler function.
 *
 * @param {object} event The API Gateway request object.
 *
 * @returns {object} The API Gateway response object.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { req, res } = createHTTPEvent(event, config);

  log.debug('Test Request', req);

  try {
    const _res = noContent();

    log.debug('Test Response', {
      res: _res
    });

    return res.send(_res);
  } catch (err) {
    log.error('It failed...', {
      error: err
    });

    return res.handle(err);
  }
}
