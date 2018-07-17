/**
 * Database cleanup handler.
 *
 * @module tests/database/cleanup
 */

const fs = require('fs');

const Database = require('../../../service/components/database');

module.exports = async () => {
  const db = new Database();

  const data = await new Promise(resolve => {
    fs.readFile(`${__dirname}/data.json`, (err, data) => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        resolve();
      }
    });
  });

  if (data) {
    await db.connect();

    await db.model('user').remove({
      _id: data._id
    });

    await db.disconnect();
  }

  await new Promise((resolve, reject) => {
    fs.unlink(`${__dirname}/data.json`, err => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
