export default {
  // No need to set the `handler` or `name` as the function loader does it
  description: 'GraphQL endpoint handler.',
  events: [
    {
      http: {
        method: 'any',
        path: '/graphql',
        cors: '${self:custom.cors}',
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
