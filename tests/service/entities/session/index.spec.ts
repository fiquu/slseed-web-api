import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { expect } from 'chai';

import { createTestDatabaseAndStub, StubbedTestDatabase } from '../../../helpers/database';
import { UserDocument } from '../../../../service/entities/user/schema.types';
import { getQueryBody } from '../../../helpers/graphql';
import { createUser } from '../../../helpers/users';
import { getEvent } from '../../../helpers/events';
import queries from './graphql/queries';

describe('query session', function () {
  this.timeout(5000);

  let tdb: StubbedTestDatabase;
  let user: UserDocument;
  let handler;

  before(async function () {
    tdb = await createTestDatabaseAndStub(true);

    handler = getWrapper('graphql', '/functions/graphql/handler.ts', 'handler');

    user = await createUser();
  });

  it('rejects with no auth', async function () {
    const event = getEvent(null, {
      body: getQueryBody({
        query: queries.session
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.an('object');
    expect(body.data.session).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.map(({ message }) => message)).to.include('ERR_NO_AUTH_SUBJECT');
  });

  it('rejects with invalid sub', async function () {
    const event = getEvent('not-a-sub', {
      body: getQueryBody({
        query: queries.session
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.an('object');
    expect(body.data.session).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.map(({ message }) => message)).to.include('ERR_NO_AUTH_DATA_FOUND');
  });

  it('succeeds with auth', async function () {
    const event = getEvent(user.sub, {
      body: getQueryBody({
        query: queries.session
      })
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const { data } = JSON.parse(res.body);

    expect(data).to.be.an('object');
    expect(data.session).to.be.an('object').with.keys('_id', 'name');
    expect(user._id.equals(data.session._id)).to.be.true;
    expect(data.session.name).to.equal(user.name);
  });

  after(async function () {
    await tdb.stopAndRestore();
  });
});
