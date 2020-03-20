import { GraphQLServerLambda } from 'graphql-yoga';
import {
  APIGatewayProxyEvent as Event,
  APIGatewayEventRequestContext as Context,
  APIGatewayProxyResult as Result
} from 'aws-lambda';

import { resolvers, typeDefs } from '../../components/graphql';

/**
 * GraphQL handler function.
 *
 * @param {object} event Call event object.
 * @param {object} context Context object.
 *
 * @returns {Promise} A promise to the response.
 */
export function handler(event: Event, context: Context): Promise<Result> {
  try {
    const { graphqlHandler } = new GraphQLServerLambda({
      context: (): Event => event,
      resolvers: { ...resolvers },
      typeDefs: String(typeDefs)
    });

    return new Promise(resolve => {
      graphqlHandler(event, context, (err: Error, result: Result): void => {
        if (err) {
          console.error(err);
        }

        resolve(result);
      });
    });
  } catch (err) {
    console.error(err);

    return Promise.resolve({
      statusCode: 500,
      body: ''
    });
  }
}
