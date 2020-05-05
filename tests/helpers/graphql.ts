import { DocumentNode } from 'graphql';

interface Params {
  query: DocumentNode;
  variables?: any;
}

/**
 * @param {object} params The GraphQL query params.
 *
 * @returns {string} The query body.
 */
export function getQueryBody({ query, variables = {} }: Params): string {
  return JSON.stringify({ query, variables });
}
