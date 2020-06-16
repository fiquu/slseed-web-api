import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';

export default loadFilesSync(join('service', 'entities', '**', 'resolvers.ts'), {
  recursive: true
});
