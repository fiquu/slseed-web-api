import '../../helpers/defaults'; // Always load first

import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Types } from 'mongoose';
import { expect } from 'chai';
import faker from 'faker';

import { UserDocument } from '../../../service/entities/user/schema.db';
import { getQueryBody } from '../../helpers/graphql';
import { createUser } from '../../helpers/users';
import { getEvent } from '../../helpers/events';
import db from '../../helpers/database';
import mutations from './mutations';

const { ObjectId } = Types;

suite('updateUser', function () {
  this.timeout(5000);

  let users: UserDocument[];
  let wrapped;

  setup(async function () {
    await db.connect();

    wrapped = getWrapper('graphql', '/functions/graphql/handler.ts', 'handler');

    users = await Promise.all(Array(1).fill(0).map(() => createUser('user')));
  });

  test('rejects with no auth', async function () {
    const event = getEvent(null, {
      body: getQueryBody({
        query: mutations.updateUser,
        variables: {
          _id: users[0]._id.toHexString(),
          input: {
            name: faker.name.findName()
          }
        }
      })
    });

    const res: APIGatewayProxyResult = await wrapped.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.map(({ message }) => message)).to.include('ERR_NO_AUTH_SUBJECT');
  });

  test('rejects with non-existen ID', async function () {
    const input = {
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

    const res: APIGatewayProxyResult = await wrapped.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.map(({ message }) => message)).to.include('ERR_NONE_MODIFIED');
  });

  test('updates a User by its ID', async function () {
    const input = {
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

    const res: APIGatewayProxyResult = await wrapped.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const { data } = JSON.parse(res.body);

    expect(data).to.be.an('object');
    expect(data.updateUser).to.be.an('object');
    expect(users[0]._id.equals(data.updateUser._id)).to.be.true;
    expect(data.updateUser.createdAt).to.be.a('string');
    expect(data.updateUser.updatedAt).to.be.a('string');
    expect(data.updateUser.name).to.equal(input.name);
    expect(data.updateUser.sub).to.equal(users[0].sub);
  });

  teardown(async function () {
    await db.disconnect();
  });
});
