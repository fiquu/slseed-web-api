import { getWrapper } from 'serverless-mocha-plugin';
import { APIGatewayProxyResult } from 'aws-lambda';
import { expect } from 'chai';

import { getEvent } from '../../helpers/events';

describe('query session', function () {
  this.timeout(30000);

  let handler;

  before(async function () {
    handler = getWrapper('graphql', '/functions/rest/handler.ts', 'handler');
  });

  it('succeeds', async function () {
    const res: APIGatewayProxyResult = await handler.run(getEvent());

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(204);

    const body = JSON.parse(res.body);

    expect(body).to.be.a('string');
  });

  it('fails', async function () {
    const event = getEvent(null, {
      queryStringParameters: {
        fail: 'true'
      }
    });

    const res: APIGatewayProxyResult = await handler.run(event);

    expect(res).to.be.an('object');
    expect(res.statusCode).to.equal(500);

    const body = JSON.parse(res.body);

    expect(body).to.be.a('string').that.is.empty;
  });
});
