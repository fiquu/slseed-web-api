require('../helpers/defaults'); // Set test defaults

const { expect } = require('chai');

const Database = require('../../service/components/database');

describe('User Schema', function() {
  const users = new Set();

  let db, User;

  before(async () => {
    db = new Database();

    await db.connect();

    User = db.model('user');
  });

  it('should register the User schema', () => {
    expect(db.model('user')).to.be.a('function');
  });

  /* Add create, update, delete, middlewares, etc, tests... */

  after(async () => {
    for (let user of users) {
      await User.deleteOne({ _id: user._id });
    }

    await db.disconnect();
  });
});
