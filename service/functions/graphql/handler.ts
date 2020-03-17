import { GraphQLServerLambda } from 'graphql-yoga';
import {
  APIGatewayProxyEvent as Event,
  APIGatewayEventRequestContext as Context,
  APIGatewayProxyCallback as Callback
} from 'aws-lambda';

import { resolvers, typeDefs } from '../../components/graphql';

console.info(resolvers, typeDefs);

/**
 * Document create handler function.
 *
 * @param {object} event Call event object.
 * @param {object} context Context object.
 * @param {Function} callback Callback function.
 */
export function handler(event: Event, context: Context, callback: Callback): void {
  const { graphqlHandler } = new GraphQLServerLambda({
    context: (): Event => event,
    resolvers: { ...resolvers },
    typeDefs: String(typeDefs)
  });

  // Can't use async because it would call the callback twice.
  graphqlHandler(event, context, callback);
}
