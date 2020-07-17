import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { ApolloServer } from 'apollo-server-lambda';

import config from '../../configs/graphql';

const { LOG_LEVEL, NODE_ENV } = process.env;

const resolvers = mergeResolvers(config.resolvers);
const typeDefs = mergeTypeDefs(loadFilesSync(config.typeDefs, {
  recursive: true
}));

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
  cors: config.cors
});
