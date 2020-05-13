import { v4 as uuid } from 'uuid';
import faker from 'faker';

import { UserDocument, UserCreateInput } from '../../service/entities/user/schema.types';
import db from '../../service/components/database';

/**
 * @returns {object} A valid User create input.
 */
export function getUserCreateInput(): UserCreateInput {
  const sub = uuid();

  return {
    name: faker.name.findName(),
    sub
  };
}

/**
 * @returns {Promise<object>} A promise to the user.
 */
export async function createUser() {
  const conn = await db.connect();
  const input = getUserCreateInput();
  const user = await conn.model('user').create(input);

  return user.toObject() as UserDocument;
}
