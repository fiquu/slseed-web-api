import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { expect } from 'chai';
import faker from 'faker';

import db, { manager } from '../../../service/components/database';
import schemas from '../../../service/configs/schemas';
import config from '../../../service/configs/database';

describe('component database', function () {
  this.timeout(30000);

  let mongod: MongoMemoryServer;

  describe('default', function () {
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

  describe('named', function () {
    let name: string;

    before(async function () {
      mongod = await MongoMemoryServer.create();
      name = faker.random.word();
      manager.add(name, {
        uri: await mongod.getUri(true),
        options: config.options
      });

      schemas.set(name, schemas.get('default'));
    });

    it('connects', async function () {
      await expect(db.connect(name)).to.eventually.be.fulfilled;
    });

    it('disconnects', async function () {
      await expect(db.disconnect(name)).to.eventually.be.fulfilled;
    });

    after(async function () {
      await mongod.stop();
    });
  });
});
