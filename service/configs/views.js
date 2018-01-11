/**
 * Views config module.
 *
 * @module configs/views
 */

const moment = require('moment');

module.exports = {
  views: [], // Views list
  locals: {
    // Default locals to inject on each render
    utils: {
      moment
    }
  }
};
