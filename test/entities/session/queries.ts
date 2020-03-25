import gql from 'graphql-tag';

export default {
  session: gql`
    query Session {
      session {
        _id
        name
      }
    }
  `
};
