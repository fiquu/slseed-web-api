import { print } from 'graphql';
import gql from 'graphql-tag';

export default {
  session: print(gql`
    query Session {
      session {
        _id
        name
      }
    }
  `)
};
