/* eslint-disable node/no-unpublished-require */
const { join, resolve, dirname } = require('path');
const slug = require('url-slug');
const glob = require('glob');

const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.ts');
const files = glob.sync(resolve(pattern));

for (const file of files) {
  const name = slug(file.replace(/^.+\/service\/functions\/(.+)\/config\.ts$/, '$1'));
  const path = file.replace(process.cwd(), '').replace(/^\//, '');
  const config = require(file).default;

  config.handler = `${join(dirname(path), 'handler')}.handler`;
  config.name = name;

  module.exports[String(name)] = config;
}
