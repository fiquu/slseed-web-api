require('../helpers/defaults'); // Set test defaults

const { expect } = require('chai');

const Database = require('../../service/components/database');

describe('Notification Schema', function() {
  const notifications = new Set();

  let db, Notification;

  before(async () => {
    db = new Database();

    await db.connect();

    Notification = db.model('notification');
  });

  it('should register the Notification schema', () => {
    expect(db.model('notification')).to.be.a('function');
  });

  /* Add create, update, delete, middlewares, etc, tests... */

  after(async () => {
    for (let notification of notifications) {
      await Notification.deleteOne({ _id: notification._id });
    }

    await db.disconnect();
  });
});
