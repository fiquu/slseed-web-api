import { conflict, badRequest } from '@fiquu/lambda-http-event-handler/lib/responses';
import { HTTPEventConfig } from '@fiquu/lambda-http-event-handler';

const handlers = new Map();

handlers.set('ValidationError', badRequest);
handlers.set('MongoError', badRequest);
handlers.set(11000, conflict);

const config: HTTPEventConfig = {
  res: {
    handlers
  }
};

export default config;
