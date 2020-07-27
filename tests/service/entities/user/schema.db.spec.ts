import mongoose from 'mongoose';
import { expect } from 'chai';
import faker from 'faker';

import { UserCreateInput, UserDocument } from '../../../../service/entities/user/schema.types';
import schema from '../../../../service/entities/user/schema.db';

import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import { getUserCreateInput } from '../../../helpers/users';

const { ValidationError } = mongoose.Error;

describe('schema user', function () {
  this.timeout(30000);

  let db: StubbedTestDatabase;

  before(async function () {
    db = await createTestDatabaseAndStub();
  });

  it('registers schema', async function () {
    expect(() => db.conn.model('user', schema)).to.not.throw();
    expect(db.conn.model('user')).to.be.a('function');
  });

  it('creates its indexes', async function () {
    await expect(db.conn.model('user').syncIndexes()).to.eventually.be.fulfilled;
  });

  describe('create', function () {
    let user: UserDocument;

    before(async function () {
      user = await db.conn.model('user').create({
        name: faker.name.findName(),
        sub: faker.random.uuid()
      }) as UserDocument;
    });

    it('does not creates with empty name', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        name: ''
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with null name', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        name: null
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with empty sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: ''
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with null sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: null
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with invalid sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: '-not a !uuid_'
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with duplicated sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: user.sub
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(Error);
    });

    it('does not creates with invalid inputs', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        name: '',
        sub: '-not a !uuid_ foo-bar'
      };

      await expect(db.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('creates with valid inputs', async function () {
      const input: UserCreateInput = getUserCreateInput();

      await expect(db.conn.model('user').create(input)).to.eventually.be.fulfilled;
    });
  });

  after(async function () {
    await db.stopAndRestore();
  });
});
