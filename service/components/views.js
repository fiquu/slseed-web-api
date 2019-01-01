/**
 * Views Component module.
 *
 * @module components/views
 */

const config = require('../configs/views');
const templates = require('./templates');

const views = {};

for (let view of config.views) {
  views[view] = templates.get(view);
}

/**
 * Views component class.
 *
 * @class Views
 */
class Views {
  /**
   * Renders a template into an HTML string.
   *
   * @param {String} path The view's path name to render.
   * @param {Object} locals The template's locals object.
   *
   * @returns {String} The rendered HTML string.
   */
  static render(path, locals) {
    const fn = views[path];

    return fn({
      ...config.locals,
      ...locals
    });
  }
}

module.exports = Views;
