/**
 * Serverless functions configuration module.
 *
 * @module configs/functions
 */

const { join, resolve, sep, dirname } = require('path');
const glob = require('glob');
const slug = require('slug');
const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.js');
const files = glob.sync(resolve(pattern));

for (const file of files) {
  const name = slug(file.replace(/^.+\/service\/functions\/(.+)\/config\.js$/, '$1'), {
    lower: true,
    charmap: {
      ...slug.charmap,
      [sep]: '-'
    }
  });

  const path = file.replace(process.cwd(), '').replace(/^\/config\.js$/, '');
  const config = require(file);

  config.handler = `${join(dirname(path), 'handler')}.handler`;
  config.name = name;

  module.exports[name] = config;
}
