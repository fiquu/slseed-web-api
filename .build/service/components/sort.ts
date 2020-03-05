const DIRECTIONS = [1, -1];

const DESC = -1;

export default {

  /**
   * Creates a valid mongo sort condition
   *
   * @param {Array<String>} SORT_FIELDS The valid sort fields
   * @param {Object} req The request to evaluate
   * @param {String} req.query.field The field is going to be sorted
   * @param {Number} req.query.direction The sort direction
   * @returns {Object} A valid mongo sort condition
   */
  getCondition(SORT_FIELDS, req) {
    let sortField = req.getQuery('sortField');
    let sortDir = req.getQuery('sortDir');

    sortDir = parseInt(sortDir);

    if (!SORT_FIELDS.includes(sortField)) {
      sortField = 'updatedAt';
    }

    if (!DIRECTIONS.includes(sortDir)) {
      sortDir = DESC;
    }

    return {
      [sortField]: sortDir
    };
  }
}
