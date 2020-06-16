import { join } from 'path';

export default {
  resolvers: join('service', 'entities', '**', 'resolvers.ts'),
  typeDefs: join('service', 'entities', '**', '*.graphql')
};
