const mochaPlugin = require('serverless-mocha-plugin');

const { expect } = mochaPlugin.chai;

const wrapped = mochaPlugin.getWrapper('test', '/service/functions/test', 'handler');

describe('Test Function', function() {
  this.timeout(30000);

  it('should respond 204 (NoContent)', async () => {
    const res = await wrapped.run({});

    expect(res).to.not.be.empty;
    expect(res.statusCode).to.equal(204);
    expect(res.body).to.be.empty;
  });
});
