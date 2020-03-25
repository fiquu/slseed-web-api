import { MongoMemoryServer } from 'mongodb-memory-server-core';
import mongoose, { Connection } from 'mongoose';

let mongod: MongoMemoryServer;
let conn: Connection;
let db;

let stopTimeout;

/**
 *
 */
export async function connect(): Promise<Connection> {
  clearTimeout(stopTimeout); // Clear stop timeout to avoid loosing topology.

  if (conn) {
    return conn;
  }

  mongod = await MongoMemoryServer.create();

  process.env.DB_URI = await mongod.getConnectionString(true);

  if (!db) {
    db = (await import('../../service/components/database')).default;
  }

  conn = await db.connect();

  await Promise.all(conn.modelNames().map(model => {
    return conn.model(model).syncIndexes();
  }));

  return conn;
}

/**
 * Wait a bit before destroying all to avoid recreating database connections or loosing topology and connect can be
 * called again.
 */
export async function disconnect(): Promise<void> {
  stopTimeout = setTimeout(async () => {
    await mongoose.disconnect(); // WTF?

    if (conn) {
      await db.disconnect();
      conn = null;
    }

    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
  }, 1000);
}

export default {
  disconnect,
  connect
};
