import '../../../helpers/defaults'; // Always load first

import mongoose from 'mongoose';
import { expect } from 'chai';
import faker from 'faker';

import { UserCreateInput, UserDocument } from '../../../../service/entities/user/schema.types';
import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import schema from '../../../../service/entities/user/schema.db';

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
        name: '',
        sub: faker.random.uuid()
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with null name', async function () {
      const input: UserCreateInput = {
        name: null,
        sub: faker.random.uuid()
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with empty sub', async function () {
      const input: UserCreateInput = {
        name: faker.name.findName(),
        sub: ''
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with null sub', async function () {
      const input: UserCreateInput = {
        name: faker.name.findName(),
        sub: null
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with invalid sub', async function () {
      const input: UserCreateInput = {
        name: faker.name.findName(),
        sub: '-not a !uuid_'
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('does not creates with duplicated sub', async function () {
      const input: UserCreateInput = {
        name: faker.name.findName(),
        sub: user.sub
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(Error);
    });

    it('does not creates with invalid inputs', async function () {
      const input: UserCreateInput = {
        name: '',
        sub: '-not a !uuid_ foo-bar'
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.rejectedWith(ValidationError);
    });

    it('creates with valid inputs', async function () {
      const input: UserCreateInput = {
        name: faker.name.findName(),
        sub: faker.random.uuid()
      };

      await expect(tdb.conn.model('user').create(input)).to.eventually.be.fulfilled;
    });
  });

  after(async function () {
    await tdb.stopAndRestore();
  });
});
