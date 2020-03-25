import { v4 as uuid } from 'uuid';
import { Types } from 'mongoose';
import faker from 'faker';

import db from './database';

export interface User {
  _id?: Types.ObjectId;
  name: string;
  sub: string;
}

/**
 * @param {string} model The model name to use as User.
 *
 * @returns {Promise<object>} A promise to the user.
 */
export async function createUser(model: string): Promise<User> {
  const conn = await db.connect();
  const sub = uuid();

  await conn.model(model).create({
    name: faker.name.findName(),
    sub
  });

  const user: any = await conn.model(model).findOne()
    .where('sub').equals(sub)
    .lean();

  return user as User;
}
