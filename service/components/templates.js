/**
 * Templates Component module.
 *
 * @module components/templates
 */

const path = require('path');
const pug = require('pug');

const options = {
  basedir: path.join('service', 'views'),
  self: true
};

/**
 * Compiles a template relative.
 *
 * @param {String} rel The view's template relative path.
 */
function get(rel) {
  return pug.compileFile(`${path.join(options.basedir, rel)}.pug`, options);
}

module.exports.get = get;
