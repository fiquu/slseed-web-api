/**
 * Auth save data handler.
 *
 * @module tests/auth/save-data
 */

const fs = require('fs');

module.exports = async data => {
  await new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/data.json`, data, err => {
      err ? reject(err) : resolve();
    });
  });
};
