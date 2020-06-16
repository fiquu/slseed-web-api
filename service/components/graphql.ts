import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import _resolvers from '../configs/resolvers';
import _typeDefs from '../configs/type-defs';

export const resolvers = mergeResolvers(_resolvers);
export const typeDefs = mergeTypeDefs(_typeDefs);

