import mongoose from 'mongoose';
import { expect } from 'chai';
import faker from 'faker';

import { UserCreateInput, UserDocument } from '../../../../service/entities/user/schema.types';
import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import schema from '../../../../service/entities/user/schema.db';
import { getUserCreateInput } from '../../../helpers/users';

const { ValidationError } = mongoose.Error;

describe('schema user', function () {
  this.timeout(5000);

  let tdb: StubbedTestDatabase;

  before(async function () {
    tdb = await createTestDatabaseAndStub();
  });

  it('registers schema', async function () {
    expect(() => tdb.conn.model('user', schema)).to.not.throw();
    expect(tdb.conn.model('user')).to.be.a('function');
  });

  it('creates its indexes', async function () {
    await expect(tdb.conn.model('user').syncIndexes()).to.eventually.be.fulfilled;
  });

  describe('create', function () {
    let user: UserDocument;

    before(async function () {
      user = await tdb.conn.model('user').create({
        name: faker.name.findName(),
        sub: faker.random.uuid()
      }) as UserDocument;
    });

    it('does not creates with empty name', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        name: ''
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with null name', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        name: null
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with empty sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: ''
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with null sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: null
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with invalid sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: '-not a !uuid_'
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with duplicated sub', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        sub: user.sub
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(Error);
    });

    it('does not creates with invalid inputs', async function () {
      const input: UserCreateInput = {
        ...getUserCreateInput(),
        name: '',
        sub: '-not a !uuid_ foo-bar'
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('creates with valid inputs', async function () {
      const input: UserCreateInput = getUserCreateInput();

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.fulfilled;
    });
  });

  after(async function () {
    await tdb.stopAndRestore();
  });
});
