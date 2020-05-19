import { print } from 'graphql';
import gql from 'graphql-tag';

export default {
  updateUser: print(gql`
    mutation User($_id: ID! $input: UpdateUserInput!) {
      updateUser(_id: $_id input: $input) {
        _id
        sub
        name
        createdAt
        updatedAt
      }
    }
  `)
};
