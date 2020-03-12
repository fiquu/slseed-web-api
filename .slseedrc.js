const { name } = require('./package.json');
const { join } = require('path');

module.exports = {
  stack: name.replace(/\W+/g, ' ').trim().replace(/\s+/g, '-'),
  configs: join(__dirname, 'configs'),
  service: join(__dirname, 'service'),
  dist: join(__dirname, 'dist'),
  root: __dirname,
  type: 'api'
}
