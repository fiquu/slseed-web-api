import { noContent } from '@fiquu/lambda-http-event-handler/lib/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createHTTPEvent } from '@fiquu/lambda-http-event-handler';
import { createLogger } from '@fiquu/logger';

import config from '../../configs/http-event';

const log = createLogger('HTTP /api/my-path');

/**
 * Test handler function.
 */
export default function handler(event: APIGatewayProxyEvent): APIGatewayProxyResult {
  const { req, res } = createHTTPEvent(event, config);

  log.debug(req.headers);
  log.debug(req.params);
  log.debug(req.query);
  log.debug('Body:', req.body);

  try {
    return res.send(noContent());
  } catch (err) {
    log.error('It failed...', { err });
    return res.handle(err);
  }
}
