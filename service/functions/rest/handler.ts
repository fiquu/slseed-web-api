import { noContent } from '@fiquu/lambda-http-event-handler/lib/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createHTTPEvent } from '@fiquu/lambda-http-event-handler';
import { createLogger } from '@fiquu/logger';

import responses from '../../configs/responses';
import config from '../../configs/http-event';

const log = createLogger('functions/rest');

/**
 * Test handler function.
 *
 * @param {object} event The API Gateway request object.
 *
 * @returns {object} The API Gateway response object.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { req, res } = createHTTPEvent(event, config);

  log.debug('REST Request', req);

  try {
    if (req.query.get('fail') === 'true') {
      throw new Error('Test error');
    }

    const _res = noContent({
      headers: responses.headers
    });

    log.debug('REST Response', {
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
