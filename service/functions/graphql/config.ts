export default {
  description: 'GraphQL endpoint handler.',
  events: [
    {
      http: {
        method: 'post',
        path: '/graphql',
        cors: '${self:custom.cors}',
        authorizer: '${self:custom.authorizer}',
      }
    }
  ]
};
