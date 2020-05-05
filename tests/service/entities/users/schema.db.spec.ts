import '../../../helpers/defaults'; // Always load first

import { expect } from 'chai';

import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import schema from '../../../../service/entities/user/schema.db';

describe('user schema', function () {
  this.timeout(5000);

  let tdb: StubbedTestDatabase;

  before(async function () {
    tdb = await createTestDatabaseAndStub();
  });

  it('registers schema', async function () {
    expect(() => tdb.conn.model('user', schema)).to.not.throw();
    expect(tdb.conn.model('user')).to.be.a('function');
  });

  after(async function () {
    await tdb.stopAndRestore();
  });
});
