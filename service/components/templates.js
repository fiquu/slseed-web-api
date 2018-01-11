/**
 * Templates Component module.
 *
 * @module components/templates
 */

const path = require('path');
const pug = require('pug');

const OPTIONS = {
  basedir: path.join('service', 'views'),
  self: true
};

/**
 * Compiles a template relative.
 *
 * @param {String} rel The view's template relative path.
 */
function get(rel) {
  return pug.compileFile(`${path.join(OPTIONS.basedir, rel)}.pug`, OPTIONS);
}

module.exports.get = get;
