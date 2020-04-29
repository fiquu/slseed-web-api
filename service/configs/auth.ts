const config = new Map();

config.set('model', 'user');
config.set('pipeline', [
  // Add here some lookups or projections if necessary
  {
    $limit: 1
  }
]);

export default config;
