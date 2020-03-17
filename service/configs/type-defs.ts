import { fileLoader } from 'merge-graphql-schemas';
import { join } from 'path';

const typesGlob = join('service', 'entities', '**', '*.graphql');

export default fileLoader(typesGlob, {
  recursive: true
});
