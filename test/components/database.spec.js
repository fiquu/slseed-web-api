require('../helpers/defaults'); // Set test defaults

const { expect } = require('chai');

const Database = require('../../service/components/database');

describe('Database Component', function() {
  this.timeout(10000);

  let db;

  it('should create a new instance', async () => {
    db = new Database();

    expect(db).to.be.an('object');
    expect(typeof db.connect).to.equal('function'); // Async fn
    expect(typeof db.disconnect).to.equal('function'); // Async fn
    expect(typeof db.model).to.equal('function'); // Async fn
  });

  it('should connect to the database', async () => {
    await expect(db.connect()).to.eventually.be.fulfilled;
  });

  it('should reuse the database connection', async () => {
    await expect(db.connect()).to.eventually.be.fulfilled;
  });

  it('should load a model', () => {
    expect(db.model('notification')).to.be.a('function');
    expect(db.model('user')).to.be.a('function');
  });

  it('should disconnect from the database', async () => {
    await expect(db.disconnect()).to.eventually.be.fulfilled;
  });

  after(async () => {
    await db.disconnect();
  });
});
