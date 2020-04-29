import { GraphQLServerLambda } from 'graphql-yoga';
import { createLogger } from '@fiquu/logger';
import {
  APIGatewayProxyEvent as Event,
  APIGatewayEventRequestContext as Context,
  APIGatewayProxyResult as Result
} from 'aws-lambda';

import { resolvers, typeDefs } from '../../components/graphql';

const log = createLogger('graphql-playground-handler');

/**
 * GraphQL Playground handler function.
 *
 * @param {object} event Call event object.
 * @param {object} context Context object.
 *
 * @returns {Promise} A promise to the response.
 */
export function handler(event: Event, context: Context): Promise<Result> {
  try {
    const { playgroundHandler } = new GraphQLServerLambda({
      context: (): Event => event,
      resolvers: { ...resolvers },
      typeDefs: String(typeDefs),
      options: {
        debug: process.env.LOG_LEVEL === 'debug'
      }
    });

    return new Promise(resolve => {
      playgroundHandler(event, context, (err: Error, result: Result): void => {
        if (err) {
          log.error('Playground handler error', {
            error: err
          });
        }

        resolve(result);
      });
    });
  } catch (err) {
    log.error('Unknown Playground handler error', {
      error: err
    });

    return Promise.resolve({
      statusCode: 500,
      body: ''
    });
  }
}
