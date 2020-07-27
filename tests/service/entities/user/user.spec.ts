import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { expect } from 'chai';

import { UserDocument } from '../../../../service/entities/user/schema.types';

import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import { getQueryBody } from '../../../helpers/graphql';
import { createUser } from '../../../helpers/users';
import { getEvent } from '../../../helpers/events';

import queries from './graphql/queries';

describe('query user', function () {
  this.timeout(30000);

  let db: StubbedTestDatabase;
  let users: UserDocument[];
  let handler;

  before(async function () {
    db = await createTestDatabaseAndStub(true);

    handler = getWrapper('graphql', '/functions/graphql/handler.ts', 'handler');

    users = await Promise.all(Array(10).fill(0).map(() => createUser(db.conn)));
  });

  it('rejects with no auth', async function () {
    const event = getEvent(null, {
      body: getQueryBody({
        query: queries.user,
        variables: {
          _id: users[0]._id.toHexString()
        }
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.an('object');
    expect(body.data.user).to.be.null;
    expect(body.errors).to.be.an('array').of.length(1);
    expect(body.errors[0].message).to.include('No auth subject provided');
  });

  it('finds a User by its ID', async function () {
    const event = getEvent(users[0].sub, {
      body: getQueryBody({
        query: queries.user,
        variables: {
          _id: users[0]._id.toHexString()
        }
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const { data } = JSON.parse(res.body);

    expect(data).to.be.an('object');
    expect(data.user).to.be.an('object').with.keys('_id', 'name', 'sub', 'createdAt', 'updatedAt');
    expect(users[0]._id.equals(data.user._id)).to.be.true;
    expect(data.user.createdAt).to.be.a('string');
    expect(data.user.updatedAt).to.be.a('string');
    expect(data.user.name).to.equal(users[0].name);
    expect(data.user.sub).to.equal(users[0].sub);
  });

  after(async function () {
    await db.stopAndRestore();
  });
});
