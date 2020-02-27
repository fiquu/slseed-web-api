module.exports = {
  description: 'Resolves the current User session data.',
  events: [
    {
      http: {
        method: 'get',
        path: '/session',
        cors: '${self:custom.cors}',
        authorizer: '${self:custom.authorizer}'
      }
    }
  ]
};
