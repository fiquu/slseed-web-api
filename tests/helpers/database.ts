import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { createConnection, Connection } from 'mongoose';
import { stub } from 'sinon';

import schemas from '../../service/components/schemas';
import config from '../../service/configs/database';
import db from '../../service/components/database';

export interface TestDatabase {
  /**
   * The in-memory mongod instance.
   */
  mongod: MongoMemoryServer;

  /**
   * The connection to the mongod instance.
   */
  conn: Connection;

  /**
   * Closes the database connection and stops the mongod instance.
   */
  stop(): Promise<void>;
}

export interface StubbedTestDatabase {
  /**
   * The in-memory mongod instance.
   */
  mongod: MongoMemoryServer;

  /**
   * The connection to the mongod instance.
   */
  conn: Connection;

  /**
   * Closes the database connection and stops the mongod instance.
   */
  stopAndRestore(): Promise<void>;
}

/**
 * Creates a test in-memory database  instance and opens a connection.
 */
export async function createTestDatabase() {
  const mongod = new MongoMemoryServer();
  const uri = await mongod.getUri(true);
  const conn = createConnection(uri, {
    ...config.options
  });

  return {
    mongod,
    conn,

    async stop() {
      await mongod.stop();
      await conn.close();
    }
  } as TestDatabase;
}

/**
 * Creates a test in-memory database instance and stubs the database component.
 *
 * @param {boolean} loadSchemas Whether to register all schemas.
 */
export async function createTestDatabaseAndStub(loadSchemas = false) {
  const tdb = await createTestDatabase();
  const _dbConnect = stub(db, 'connect').returns(Promise.resolve(tdb.conn));
  const _dbDisconnect = stub(db, 'disconnect').returns(Promise.resolve());

  if (loadSchemas) {
    schemas.load('default', tdb.conn);
  }

  return {
    mongod: tdb.mongod,
    conn: tdb.conn,

    async stopAndRestore() {
      _dbDisconnect.restore();
      _dbConnect.restore();

      await tdb.stop();
    }
  } as StubbedTestDatabase;
}
