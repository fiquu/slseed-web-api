/**
 * Cognito create handler.
 *
 * @module tests/cognito/create
 */

const fs = require('fs');

const Database = require('../../../service/components/database');
const package = require('../../../package.json');

module.exports = async sub => {
  const db = new Database();

  await db.connect();

  const genders = await db
    .model('gender')
    .find()
    .lean();

  const data = {
    name: `${package.group.name} Test User`,
    gender: genders[0]._id,
    sub
  };

  const user = await db.model('user').create(data);

  await db.disconnect();

  await new Promise((resolve, reject) => {
    const json = JSON.stringify(user);

    fs.writeFile(`${__dirname}/data.json`, json, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
