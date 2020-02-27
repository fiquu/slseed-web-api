module.exports = {
  description: 'Lists all available Users.',
  events: [
    {
      http: {
        method: 'get',
        path: '/users',
        cors: '${self:custom.cors}',
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
