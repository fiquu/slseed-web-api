/**
 * Schemas Component module.
 *
 * @module components/schemas
 */
import { createSchemaLoader } from '@fiquu/schema-loader-mongoose';

import config from '../configs/schemas';
import { Connection } from 'mongoose';

/**
 * Loads all schemas into the default database connection.
 *
 * @param {Connection} conn The connection to load into.
 */
function load(name = 'default', conn: Connection): void {
  const { schemas, options } = config.get(name);
  const loader = createSchemaLoader(conn, options);

  loader.loadAll(schemas);
}

export default { load };
