import '../../../helpers/defaults'; // Always load first

import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Types } from 'mongoose';
import { expect } from 'chai';
import faker from 'faker';

import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import { UserDocument, UserUpdateInput } from '../../../../service/entities/user/schema.types';
import { getQueryBody } from '../../../helpers/graphql';
import { createUser } from '../../../helpers/users';
import { getEvent } from '../../../helpers/events';
import mutations from './graphql/mutations';

const { ObjectId } = Types;

describe('mutation updateUser', function () {
  this.timeout(5000);

  let tdb: StubbedTestDatabase;
  let users: UserDocument[];
  let handler;

  before(async function () {
    tdb = await createTestDatabaseAndStub(true);

    handler = getWrapper('graphql', '/functions/graphql/handler.ts', 'handler');

    users = await Promise.all(Array(1).fill(0).map(() => createUser('user')));
  });

  it('rejects with no auth', async function () {
    const input: UserUpdateInput = {
      name: faker.name.findName()
    };

    const event = getEvent(null, {
      body: getQueryBody({
        query: mutations.updateUser,
        variables: {
          _id: users[0]._id.toHexString(),
          input
        }
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.map(({ message }) => message)).to.include('ERR_NO_AUTH_SUBJECT');
  });

  it('rejects with non-existen ID', async function () {
    const input: UserUpdateInput = {
      name: faker.name.findName()
    };

    const event = getEvent(users[0].sub, {
      body: getQueryBody({
        query: mutations.updateUser,
        variables: {
          _id: new ObjectId().toHexString(),
          input
        }
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.map(({ message }) => message)).to.include('ERR_NONE_MODIFIED');
  });

  it('updates a User by its ID', async function () {
    const input: UserUpdateInput = {
      name: faker.name.findName()
    };

    const event = getEvent(users[0].sub, {
      body: getQueryBody({
        query: mutations.updateUser,
        variables: {
          _id: users[0]._id.toHexString(),
          input
        }
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const { data } = JSON.parse(res.body);

    expect(data).to.be.an('object');
    expect(data.updateUser).to.be.an('object').with.keys('_id', 'createdAt', 'updatedAt', 'name', 'sub');
    expect(users[0]._id.equals(data.updateUser._id)).to.be.true;
    expect(data.updateUser.createdAt).to.be.a('string');
    expect(data.updateUser.updatedAt).to.be.a('string');
    expect(data.updateUser.name).to.equal(input.name);
    expect(data.updateUser.sub).to.equal(users[0].sub);
  });

  after(async function () {
    await tdb.stopAndRestore();
  });
});