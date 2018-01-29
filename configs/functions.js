/**
 * Serverless functions configuration.
 *
 * @module configs/functions
 */

const walk = require('walk-sync');
const path = require('path');
const slug = require('slug');

/* Resolve base dir */
const basedir = path.resolve(path.join(__dirname, 'functions'));

/* Get paths relative to basedir */
const paths = walk(basedir);

/* Define and declare each found function */
paths.forEach(value => {
  if (path.extname(value) === '.js') {
    const name = slug(value.replace(/\.js/gi, '').replace(/\//g, '-'), {
      lower: true
    });

    module.exports[name] = require(path.join(basedir, value));
  }
});
