/**
 * Auth get data handler.
 *
 * @module tests/auth/get-data
 */

const fs = require('fs');

module.exports = async () => {
  return await new Promise(resolve => {
    fs.readFile(`${__dirname}/data.json`, (err, data) => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        resolve(null);
      }
    });
  });
};
