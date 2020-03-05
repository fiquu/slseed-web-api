export default {
  // No need to set the `handler` as the function loader does it
  description: 'Session resolver function.',
  events: [
    {
      http: {
        method: 'get',
        path: '/session',
        cors: '${self:custom.cors}'
      }
    }
  ]
};
