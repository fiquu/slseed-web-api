/* eslint-disable node/no-unpublished-require */

const { join, resolve, dirname } = require('path');
const { name } = require('../../package.json');
const slug = require('url-slug');
const glob = require('glob');

const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.ts');
const files = glob.sync(resolve(pattern));
const { NODE_ENV } = process.env;

for (const file of files) {
  const _name = slug(file.replace(/^.+\/service\/functions\/(.+)\/config\.ts$/, '$1'));
  const _path = file.replace(process.cwd(), '').replace(/^\//, '');
  const _config = require(file).default; // It's a TS file...

  _config.handler = `${join(dirname(_path), 'handler')}.handler`;
  // Prepend project name and env to avoid log group and function name collision.
  _config.name = slug(`${name}-${NODE_ENV}-${_name}`);

  module.exports[String(_name)] = _config;
}
