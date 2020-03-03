/**
 * Paginate Component module.
 *
 * @module components/paginate
 */

/**
* Returns the pagination values based on a configuration
*
* @param {Object} config The configuration object
* @param {Object} config.skip The skip configuration
* @param {Number} config.skip.min The minimum skipable
* @param {Number} config.skip.max The maximun skipable
* @param {Object} config.limit The limit configuration
* @param {Number} config.limit.min The minimum limitable
* @param {Number} config.limit.max The maximum limitable
* @param {Object} req The request to evaluate
* @returns {Object} The pagination values
*/
export const getValues = (config, req) => {
  let skip = req.getQuery('skip') || 0;
  let limit = req.getQuery('limit') || 1;

  skip = parseInt(skip);

  limit = parseInt(limit);

  if (isNaN(skip)) {
    skip = config.skip.max;
  }

  if (isNaN(limit)) {
    limit = config.limit.max;
  }

  if (limit > config.limit.max) {
    limit = config.limit.max;
  }

  // Minimun skip
  if (skip < config.skip.min) {
    skip = config.skip.min;
  }

  // Maximum skip
  if (skip > config.skip.max) {
    skip = config.skip.max;
  }

  // Minimun limit
  if (limit < config.limit.min) {
    limit = config.limit.min;
  }

  // Maximum limit
  if (limit > config.limit.max) {
    limit = config.limit.max;
  }

  return { skip, limit };
}
