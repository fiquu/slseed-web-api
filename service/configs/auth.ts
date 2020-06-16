import { UserDocument } from '../entities/user/schema.types';

const config = new Map();

export type UserType = UserDocument;

config.set('model', 'user');
config.set('pipeline', [{
  // Add here some lookups or projections if necessary
  $limit: 1
}]);

export default config;
