import { v4 as uuid } from 'uuid';
import faker from 'faker';

import { UserDocument } from '../../service/entities/user/schema.db';
import db from '../../service/components/database';

/**
 * @param {string} model The model name to use as User.
 *
 * @returns {Promise<object>} A promise to the user.
 */
export async function createUser(model: string) {
  const conn = await db.connect();
  const sub = uuid();

  await conn.model(model).create({
    name: faker.name.findName(),
    sub
  });

  const user: UserDocument = await conn.model(model).findOne()
    .where('sub').equals(sub)
    .lean();

  return user;
}
