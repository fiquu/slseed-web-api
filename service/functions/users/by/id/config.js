module.exports = {
  description: 'Lists all available Users.',
  events: [
    {
      http: {
        method: 'get',
        path: '/users/by/id/{_id}',
        cors: '${self:custom.cors}',
        authorizer: '${self:custom.authorizer}',
        request: {
          parameters: {
            paths: {
              _id: true
            }
          }
        }
      }
    }
  ]
};
