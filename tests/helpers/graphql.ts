interface Params {
  variables?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  query: string;
}

/**
 * @param {object} params The GraphQL query params.
 *
 * @returns {string} The query body.
 */
export function getQueryBody({ query, variables = {} }: Params): string {
  return JSON.stringify({ query, variables });
}
