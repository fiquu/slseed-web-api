interface Params {
  variables?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  query: string;
}

/**
 * @param {object} params The GraphQL query params.
 * @param {string} params.query The GraphQL query.
 * @param {object} params.variables The GraphQL variables.
 *
 * @returns {string} The query body.
 */
export function getQueryBody({ query, variables = {} }: Params): string {
  return JSON.stringify({ query, variables });
}
