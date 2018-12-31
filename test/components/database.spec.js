const chaiAspromised = require('chai-as-promised');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const chai = require('chai');

const { expect } = chai;

chai.use(chaiAspromised);

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

const Database = require('../../service/components/database');

mongoose.set('debug', false);

describe('Database Component', function() {
  let db;

  it('should create a new instance', async () => {
    db = new Database();

    expect(db).to.be.an('object');
    expect(typeof db.connect).to.equal('function'); // Async fn
    expect(typeof db.disconnect).to.equal('function'); // Async fn
    expect(typeof db.model).to.equal('function'); // Async fn
  });

  it('should connect to the database', async () => {
    const promise = db.connect(); // trigger connecting state

    await expect(db.connect()).to.eventually.be.fulfilled;
    await promise;
  });

  it('should reuse the database connection', async () => {
    await expect(db.connect()).to.eventually.be.fulfilled;
  });

  it('should load a model', () => {
    expect(db.model('gender')).to.be.a('function');
    expect(db.model('user')).to.be.a('function');
  });

  it('should disconnect from the database', async () => {
    await expect(db.disconnect()).to.eventually.be.fulfilled;
  });

  after(async () => {
    await db.disconnect();
  });
});
