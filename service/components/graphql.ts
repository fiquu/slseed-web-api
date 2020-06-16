import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

import config from '../configs/graphql';

export const resolvers = mergeResolvers(loadFilesSync(config.resolvers, {
  recursive: true
}));

export const typeDefs = mergeTypeDefs(loadFilesSync(config.typeDefs, {
  recursive: true
}));

