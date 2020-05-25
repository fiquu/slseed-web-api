import '../../helpers/defaults'; // Always load first

import { expect } from 'chai';

import { MongoMemoryServer } from 'mongodb-memory-server-core';
import db, { manager } from '../../../service/components/database';
import config from '../../../service/configs/database';

describe('component database', function () {
  this.timeout(5000);

  let mongod: MongoMemoryServer;

  before(async function () {
    mongod = await MongoMemoryServer.create();
    manager.add('default', {
      uri: await mongod.getUri(true),
      options: config.options
    });
  });

  it('connects', async function () {
    await expect(db.connect()).to.eventually.be.fulfilled;
  });

  it('disconnects', async function () {
    await expect(db.disconnect()).to.eventually.be.fulfilled;
  });

  after(async function () {
    await mongod.stop();
  });
});
