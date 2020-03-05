import create from './mutation/create';
import update from './mutation/update';
import many from './query/many';
import one from './query/one';

export default {
  Query: {
    users: many,
    user: one
  },
  Mutation: {
    create,
    update
  }
};
