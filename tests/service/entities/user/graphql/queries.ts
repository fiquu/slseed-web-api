import { print } from 'graphql';
import gql from 'graphql-tag';

export default {
  user: print(gql`
    query User($_id: ID!) {
      user(_id: $_id) {
        _id
        sub
        name
        createdAt
        updatedAt
      }
    }
  `),

  users: print(gql`
    query Users($pagination: PaginationInput) {
      users(pagination: $pagination) {
        _id
        sub
        name
        createdAt
        updatedAt
      }
    }
  `)
};
