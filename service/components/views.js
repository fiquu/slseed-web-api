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
 * Renders a template.
 *
 * @param {String} path The view's path name to render.
 * @param {Object} locals The locals object.
 *
 * @returns {String} The rendered HTML string.
 */
function render(path, locals) {
  return views[path]({ ...config.locals, ...locals });
}

module.exports = {
  render
};
