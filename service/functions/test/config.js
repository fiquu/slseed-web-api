module.exports = {
  description: 'Dummy test function.',
  events: [
    {
      http: {
        method: 'get',
        path: '/test',
        cors: '${self:custom.cors}',
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
