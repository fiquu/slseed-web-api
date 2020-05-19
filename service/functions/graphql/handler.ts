import { ApolloServer } from 'apollo-server-lambda';

import { resolvers, typeDefs } from '../../components/graphql';

const { LOG_LEVEL, NODE_ENV } = process.env;

const server = new ApolloServer({
  context: ({ event }) => event,
  debug: LOG_LEVEL === 'debug',
  resolvers,
  typeDefs,
  playground: {
    endpoint: `/${NODE_ENV}/graphql`
  }
});

/**
 * GraphQL handler function.
 *
 * @param {object} event Call event object.
 * @param {object} context Context object.
 *
 * @returns {Promise} A promise to the response.
 */
export const handler = server.createHandler({
  cors: {
    credentials: true,
    origin: true
  }
});
