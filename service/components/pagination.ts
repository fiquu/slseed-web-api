import config from '../configs/pagination';

export interface Pagination {
  limit?: number;
  skip?: number;
}

/**
 * @param {object} pagination The passed pagination params.
 *
 * @returns {object} The normalized pagination params.
 */
export function getPagination(pagination: Pagination): Pagination {
  const { skip, limit = config.limit.default } = pagination || {};

  return {
    limit: Math.max(1, Math.min(config.limit.max, limit)),
    skip: Math.max(0, skip)
  };
}
