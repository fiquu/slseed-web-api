/**
 * Templates component module.
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
 * Templates component class.
 *
 * @class Templates
 */
class Templates {
  /**
   * Compiles a Pug template to a render function.
   *
   * @param {String} rel The view's template relative path.
   *
   * @returns {Function} The template's render function.
   */
  static get(rel) {
    return pug.compileFile(`${path.join(options.basedir, rel)}.pug`, options);
  }
}

module.exports = Templates;
