/* eslint-disable node/no-unpublished-require */

const { join, resolve, dirname } = require('path');
const { name } = require('../../package.json');
const slug = require('url-slug');
const glob = require('glob');

const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.ts');
const files = glob.sync(resolve(pattern));
const { NODE_ENV } = process.env;
const fns = {};

for (const file of files) {
  // We don't want the Playground on staging or production/
  if (['staging', 'production'].includes(NODE_ENV) && file.includes('playground')) {
    continue;
  }

  const _name = slug(file.replace(/^.+\/service\/functions\/(.+)\/config\.ts$/, '$1'));
  const _path = file.replace(process.cwd(), '').replace(/^\//, '');
  const _config = require(file).default; // It's a TS file...

  _config.handler = `${join(dirname(_path), 'handler')}.handler`;
  _config.name = slug(`${name}-${_name}`); // Prepend project name to avoid Log Group name collision.

  fns[String(_name)] = _config;
}

module.exports = fns;
