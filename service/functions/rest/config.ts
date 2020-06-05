export default {
  // No need to set the `handler` as the function loader does it
  description: 'Dummy REST function.',
  events: [{
    http: {
      method: 'get',
      path: '/rest',
      cors: '${self:custom.cors}',
      authorizer: '${self:custom.authorizer}'
    }
  }]
};
