import { SchemasMap, SchemaLoaderOptions } from '@fiquu/schema-loader-mongoose';

import user from '../../entities/user/schema.db';

const schemas: SchemasMap = new Map();
const options: SchemaLoaderOptions = {
  replace: false,
  clone: true
};

schemas.set('user', user);

export default { schemas, options };
