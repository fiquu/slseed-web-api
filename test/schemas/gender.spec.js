require('../helpers/defaults'); // Set test defaults

const { expect } = require('chai');

const Database = require('../../service/components/database');

describe('Gender Schema', function() {
  const genders = new Set();

  let db, Gender;

  before(async () => {
    db = new Database();

    await db.connect();

    Gender = db.model('gender');
  });

  it('should register the Gender schema', () => {
    expect(db.model('gender')).to.be.a('function');
  });

  /* Add create, update, delete, middlewares, etc, tests... */

  after(async () => {
    for (let gender of genders) {
      await Gender.deleteOne({ _id: gender._id });
    }

    await db.disconnect();
  });
});
