import createUser from './mutation/create';
import updateUser from './mutation/update';
import users from './query/many';
import user from './query/one';

export default {
  Query: {
    users,
    user
  },
  Mutation: {
    createUser,
    updateUser
  }
};
