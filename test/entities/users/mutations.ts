import gql from 'graphql-tag';

export default {
  updateUser: gql`
    mutation User($_id: ID! $input: UpdateUserInput!) {
      updateUser(_id: $_id input: $input) {
        _id
        sub
        name
        createdAt
        updatedAt
      }
    }
  `
};
