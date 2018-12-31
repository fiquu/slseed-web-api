const mochaPlugin = require('serverless-mocha-plugin');
const { expect } = mochaPlugin.chai;

let wrapped = mochaPlugin.getWrapper('test', '/service/functions/test', 'handler');

describe('Test', function() {
  this.timeout(30000);

  it('should respond 204 (NoContent)', () => {
    return wrapped.run({}).then(res => {
      expect(res).to.not.be.empty;
      expect(res.statusCode).to.equal(204);
      expect(res.body).to.be.empty;
    });
  });
});
