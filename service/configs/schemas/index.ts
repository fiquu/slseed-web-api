import { SchemasMap, SchemaLoaderOptions } from '@fiquu/schema-loader-mongoose';

import _default from './default';

interface SchemaConfig {
  options: SchemaLoaderOptions;
  schemas: SchemasMap;
}

const config = new Map<string, SchemaConfig>();

config.set('default', _default);

export default config;
