const mongoose = require('mongoose');
const { expect } = require('chai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

const Database = require('../../service/components/database');

mongoose.set('debug', false);

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
