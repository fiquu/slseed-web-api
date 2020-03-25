import '../../helpers/defaults'; // Always load first

import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { expect } from 'chai';

import { createUser, User } from '../../helpers/users';
import { getQueryBody } from '../../helpers/graphql';
import { getEvent } from '../../helpers/events';
import db from '../../helpers/database';
import queries from './queries';

describe('Session', function () {
  this.timeout(5000);

  let user: User;
  let wrapped;

  before(async function () {
    await db.connect();

    wrapped = getWrapper('graphql', '/functions/graphql/handler.ts', 'handler');

    user = await createUser('user');
  });

  it('should be rejected with no auth', async function () {
    const event = getEvent(null, {
      body: getQueryBody({
        query: queries.session
      })
    });

    const res: APIGatewayProxyResult = await wrapped.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.body);

    expect(body).to.be.an('object');
    expect(body.data).to.be.an('object');
    expect(body.data.session).to.be.null;
    expect(body.errors).to.be.an('array');
    expect(body.errors.find(({ message }) => message === 'ERR_NO_AUTH_SUBJECT')).to.be.an('object');
  });

  it('should succeed with auth', async function () {
    const event = getEvent(user.sub, {
      body: getQueryBody({
        query: queries.session
      })
    });

    const res: APIGatewayProxyResult = await wrapped.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(200);

    const { data } = JSON.parse(res.body);

    expect(data).to.be.an('object');
    expect(data.session).to.be.an('object');
    expect(user._id.equals(data.session._id)).to.be.true;
    expect(data.session.name).to.equal(user.name);
  });

  after(async function () {
    await db.disconnect();
  });
});
