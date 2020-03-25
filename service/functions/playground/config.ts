export default {
  // No need to set the `handler` or `name` as the function loader does it
  description: 'GraphQL Playground endpoint handler.',
  events: [
    {
      http: {
        method: 'get',
        path: '/graphql',
        cors: '${self:custom.cors}'
      }
    }
  ]
};
