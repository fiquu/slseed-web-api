/**
 * Serverless functions configuration module.
 *
 * @module configs/functions
 */

const { posix, join, resolve, sep } = require('path');
const glob = require('glob');
const slug = require('slug');
const is = require('fi-is');

const pattern = join(process.cwd(), 'service', 'functions', '**', 'config.js');
const files = glob.sync(resolve(pattern));

for (const file of files) {
  const name = slug(file.replace(/^.+\/services\/functions\/(.+)\/config\.js$/, '$1-$2'), {
    lower: true,
    charmap: {
      ...slug.charmap,
      [sep]: '-'
    }
  });

  const basePath = file.replace(/^.+\/service\/functions\/.+\/config\.js$/, '');
  const path = file.replace(process.cwd(), '').replace(/^\/config\.js$/, '');
  const config = require(file);

  for (const { http } of config.events) {
    if (is.not.empty(http)) {
      http.path = posix.normalize(posix.join('/', basePath, http.path));
    }
  }

  config.handler = `${join(path, 'handler')}.handler`;
  config.name = name;

  module.exports[name] = config;
}
