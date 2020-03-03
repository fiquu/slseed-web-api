/**
 * Database component module.
 *
 * @module components/database
 */

import { createDatabaseManager } from '@fiquu/database-manager-mongoose';

import config from '../configs/database';
import { Connection } from 'mongoose';
import schemas from './schemas';

const db = createDatabaseManager();

db.add('default', config);

async function connect(name = 'default') {
  const conn: Connection = await db.connect(name);

  await schemas.load(name, conn);

  return conn;
}

export default { connect };
