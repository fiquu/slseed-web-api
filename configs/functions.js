const { join, resolve, dirname } = require('path');
const glob = require('glob');
const slug = require('url-slug');

const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.ts');
const files = glob.sync(resolve(pattern));

for (const file of files) {
  const name = slug(file.replace(/^.+\/service\/functions\/(.+)\/config\.ts$/, '$1'));
  const path = file.replace(process.cwd(), '').replace(/^\/config\.ts$/, '');
  const config = require(file);

  config.handler = `${join(dirname(path), 'handler')}.handler`;
  config.name = name;

  module.exports[name] = config;
}
