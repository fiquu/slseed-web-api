import { join } from 'path';

// Import resolvers manually because serverless-plugin-typescript only compiles explicitely imported files.
import session from '../entities/session/resolvers';
import user from '../entities/user/resolvers';

export default {
  typeDefs: join('service', 'entities', '**', '*.graphql'),
  resolvers: [
    session,
    user
  ],
  cors: {
    origin: process.env.APP_ORIGIN,
    credentials: true
  }
};
