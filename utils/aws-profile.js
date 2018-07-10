/**
 * Sets the proper AWS profile on the `process.env` object.
 */

const profiles = require('../configs/profiles');

/**
 * Updates the current AWS profile.
 */
function update() {
  process.env.AWS_PROFILE = profiles[process.env.NODE_ENV] || 'default';
}

module.exports = {
  update
};
