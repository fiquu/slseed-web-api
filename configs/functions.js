const { join, resolve, dirname, sep } = require('path');
const slug = require('url-slug');
const glob = require('glob');

const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.ts');
const files = glob.sync(resolve(pattern));

for (const file of files) {
  const name = slug(file.replace(/^.+\/service\/functions\/(.+)\/config\.ts$/, '$1'));
  const path = file.replace(process.cwd(), '').replace(new RegExp(`^${sep}`), '');
  const config = require(file).default;

  config.handler = `${join(dirname(path), 'handler')}.handler`;
  config.name = name;

  console.info(config);

  module.exports[name] = config;
}
