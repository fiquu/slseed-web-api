import many from './query/many';
import one from './query/one';

export default {
  Query: {
    users: many,
    user: one
  }
};
