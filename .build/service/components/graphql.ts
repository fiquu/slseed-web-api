import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import _resolvers from '../configs/resolvers';
import _typeDefs from '../configs/type-defs';

export const typeDefs = mergeTypes(_typeDefs, {
  all: true
});

export const resolvers = mergeResolvers(_resolvers);
