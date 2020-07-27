import { Connection } from 'mongoose';
import { v4 as uuid } from 'uuid';
import faker from 'faker';

import { UserDocument, UserCreateInput } from '../../service/entities/user/schema.types';

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
 * @param {object} conn The connection to use.
 *
 * @returns {Promise<object>} A promise to the user.
 */
export async function createUser(conn: Connection): Promise<UserDocument> {
  const input = getUserCreateInput();
  const user = await conn.model('user').create(input);

  return user.toObject();
}
