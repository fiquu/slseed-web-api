import { GraphQLServerLambda } from 'graphql-yoga';
import { createLogger } from '@fiquu/logger';
import {
  APIGatewayProxyEvent as Event,
  APIGatewayEventRequestContext as Context,
  APIGatewayProxyResult as Result
} from 'aws-lambda';

import { resolvers, typeDefs } from '../../components/graphql';

const log = createLogger('graphql-handler');

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
      context: (): Event => ({ ...event }),
      resolvers: { ...resolvers },
      typeDefs: String(typeDefs),
      options: {
        debug: process.env.LOG_LEVEL === 'debug'
      }
    });

    return new Promise(resolve => {
      graphqlHandler(event, context, (err: Error, result: Result): void => {
        /* istanbul ignore if: This is just am optional log. */
        if (err) {
          log.error('GraphQL handler error', {
            error: err
          });
        }

        resolve(result);
      });
    });
  } catch (err) {
    /* istanbul ignore next: Triggering these errors is not an easy and may not worth testing. */
    log.error('Unknown GraphQL handler error', {
      error: err
    });

    /* istanbul ignore next: Same as above. */
    return Promise.resolve({
      statusCode: 500,
      body: ''
    });
  }
}
