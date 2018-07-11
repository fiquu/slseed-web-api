/**
 * Auth cleanup handler.
 *
 * @module tests/auth/cleanup
 */

const fs = require('fs');

module.exports = async () => {
  await new Promise((resolve, reject) => {
    fs.unlink(`${__dirname}/data.json`, err => {
      err && err.code !== 'ENOENT' ? reject(err) : resolve();
    });
  });
};
