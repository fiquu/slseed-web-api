import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Types, Connection } from 'mongoose';
import { expect } from 'chai';

import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import { UserDocument } from '../../../../service/entities/user/schema.types';
import { getQueryBody } from '../../../helpers/graphql';
import { createUser } from '../../../helpers/users';
import { getEvent } from '../../../helpers/events';
import queries from './graphql/queries';

import pag from '../../../../service/configs/pagination';

const { ObjectId } = Types;

describe('query users', function () {
  this.timeout(5000);

  let tdb: StubbedTestDatabase;
  let users: UserDocument[];
  let conn: Connection;
  let handler;

  before(async function () {
    tdb = await createTestDatabaseAndStub(true);

    conn = tdb.conn;

    handler = getWrapper('graphql', '/functions/graphql/handler.ts', 'handler');

    users = await Promise.all(Array(100).fill(0).map(() => createUser()));
  });

  it('rejects with no auth', async function () {
    const event = getEvent(null, {
      body: getQueryBody({
        query: queries.users
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

  it('finds al Users', async function () {
    const event = getEvent(users[0].sub, {
      body: getQueryBody({
        query: queries.users
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const { data } = JSON.parse(res.body);

    expect(data).to.be.an('object');
    expect(data.users).to.be.an('array').of.length(pag.limit.default);

    for (const user of data.users) {
      expect(user).to.be.an('object').with.keys('_id', 'name', 'sub', 'createdAt', 'updatedAt');
      expect(ObjectId.isValid(user._id)).to.be.true;
      expect(user.createdAt).to.be.a('string');
      expect(user.updatedAt).to.be.a('string');
      expect(user.name).to.be.a('string');
      expect(user.sub).to.be.a('string');
    }
  });

  describe('(pagination)', function () {
    it('finds all Users with a skip', async function () {
      const count = await conn.model('user').countDocuments();
      const event = getEvent(users[0].sub, {
        body: getQueryBody({
          query: queries.users,
          variables: {
            pagination: {
              skip: count - 8
            }
          }
        })
      });

      const res: APIGatewayProxyResult = await handler.run(event);

      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(200);

      const { data } = JSON.parse(res.body);

      expect(data).to.be.an('object');
      expect(data.users).to.be.an('array').of.length(8);

      for (const user of data.users) {
        expect(user).to.be.an('object').with.keys('_id', 'name', 'sub', 'createdAt', 'updatedAt');
        expect(ObjectId.isValid(user._id)).to.be.true;
        expect(user.createdAt).to.be.a('string');
        expect(user.updatedAt).to.be.a('string');
        expect(user.name).to.be.a('string');
        expect(user.sub).to.be.a('string');
      }
    });

    it('finds all Users with a limit', async function () {
      const event = getEvent(users[0].sub, {
        body: getQueryBody({
          query: queries.users,
          variables: {
            pagination: {
              limit: 7
            }
          }
        })
      });

      const res: APIGatewayProxyResult = await handler.run(event);

      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(200);

      const { data } = JSON.parse(res.body);

      expect(data).to.be.an('object');
      expect(data.users).to.be.an('array').of.length(7);

      for (const user of data.users) {
        expect(user).to.be.an('object').with.keys('_id', 'name', 'sub', 'createdAt', 'updatedAt');
        expect(ObjectId.isValid(user._id)).to.be.true;
        expect(user.createdAt).to.be.a('string');
        expect(user.updatedAt).to.be.a('string');
        expect(user.name).to.be.a('string');
        expect(user.sub).to.be.a('string');
      }
    });

    it('finds all Users with a skip and limit', async function () {
      const count = await conn.model('user').countDocuments();
      const event = getEvent(users[0].sub, {
        body: getQueryBody({
          query: queries.users,
          variables: {
            pagination: {
              skip: count - 10,
              limit: 6
            }
          }
        })
      });

      const res: APIGatewayProxyResult = await handler.run(event);

      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(200);

      const { data } = JSON.parse(res.body);

      expect(data).to.be.an('object');
      expect(data.users).to.be.an('array').of.length(6);

      for (const user of data.users) {
        expect(user).to.be.an('object').with.keys('_id', 'name', 'sub', 'createdAt', 'updatedAt');
        expect(ObjectId.isValid(user._id)).to.be.true;
        expect(user.createdAt).to.be.a('string');
        expect(user.updatedAt).to.be.a('string');
        expect(user.name).to.be.a('string');
        expect(user.sub).to.be.a('string');
      }
    });
  });

  after(async function () {
    await tdb.stopAndRestore();
  });
});
