import gql from 'graphql-tag';

export default {
  user: gql`
    query User($_id: ID!) {
      user(_id: $_id) {
        _id
        sub
        name
        createdAt
        updatedAt
      }
    }
  `,

  users: gql`
    query Users($pagination: PaginationInput) {
      users(pagination: $pagination) {
        _id
        sub
        name
        createdAt
        updatedAt
      }
    }
  `
};
