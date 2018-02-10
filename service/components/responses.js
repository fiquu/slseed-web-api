/**
 * Responses Component module.
 *
 * @module components/responses
 */

const config = require('../configs/responses');

/**
 * Default API response class object.
 *
 * @class Response
 */
class Response {
  /**
   * Creates an instance of Response.
   *
   * @param {Number} statusCode The HTTP code.
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Response
   */
  constructor(statusCode, body, headers) {
    this.headers = Object.assign({}, config.default.headers, headers);
    this.statusCode = parseInt(statusCode || 200, 10);
    this.body = '';

    if (body && this.headers['Content-Type'] === 'application/json') {
      this.body = JSON.stringify(body) || '""';
    }

    if (this.statusCode < 100 || this.statusCode > 599) {
      this.statusCode = 400;
    }
  }
}

/**
 * Ok (200) API response.
 *
 * @class Ok
 * @extends {Response}
 */
class Ok extends Response {
  /**
   * Creates an instance of Ok (200) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Ok
   */
  constructor(body, headers) {
    super(200, body, headers);
  }
}

/**
 * Created (201) API response.
 *
 * @class Ok
 * @extends {Response}
 */
class Created extends Response {
  /**
   * Creates an instance of Created (201) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Created
   */
  constructor(body, headers) {
    super(201, body, headers);
  }
}

/**
 * No Content (204) API response.
 *
 * @class NoContent
 * @extends {Response}
 */
class NoContent extends Response {
  /**
   * Creates an instance of NoContent (204) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof NoContent
   */
  constructor(body, headers) {
    super(204, body, headers);
  }
}

/**
 * Bad Request (400) API response.
 *
 * @class BadRequest
 * @extends {Response}
 */
class BadRequest extends Response {
  /**
   * Creates an instance of BadRequest (400) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof BadRequest
   */
  constructor(body, headers) {
    super(400, body, headers);
  }
}

/**
 * Unauthorized (401) API response.
 *
 * @class Unauthorized
 * @extends {Response}
 */
class Unauthorized extends Response {
  /**
   * Creates an instance of Unauthorized (401) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Unauthorized
   */
  constructor(body, headers) {
    super(401, body, headers);
  }
}

/**
 * Forbidden (403) API response.
 *
 * @class Forbidden
 * @extends {Response}
 */
class Forbidden extends Response {
  /**
   * Creates an instance of Forbidden (403) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Forbidden
   */
  constructor(body, headers) {
    super(403, body, headers);
  }
}

/**
 * Not Acceptable (406) API response.
 *
 * @class Forbidden
 * @extends {Response}
 */
class NotAcceptable extends Response {
  /**
   * Creates an instance of Not Acceptable (406) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Forbidden
   */
  constructor(body, headers) {
    super(406, body, headers);
  }
}

/**
 * Conflict (409) API response.
 *
 * @class Conflict
 * @extends {Response}
 */
class Conflict extends Response {
  /**
   * Creates an instance of Conflict (409) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof Conflict
   */
  constructor(body, headers) {
    super(409, body, headers);
  }
}

/**
 * Precondition Failed (412) API response.
 *
 * @class PreconditionFailed
 * @extends {Response}
 */
class PreconditionFailed extends Response {
  /**
   * Creates an instance of PreconditionFailed (412) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof PreconditionFailed
   */
  constructor(body, headers) {
    super(412, body, headers);
  }
}

/**
 * Internal Server Error (500) API response.
 *
 * @class InternalServerError
 * @extends {Response}
 */
class InternalServerError extends Response {
  /**
   * Creates an instance of InternalServerError (500) Response.
   *
   * @param {Mixed} body The body to be stringified as JSON.
   * @param {Object} headers Headers to send.
   *
   * @memberof InternalServerError
   */
  constructor(body, headers) {
    super(500, body, headers);
  }
}

module.exports = {
  Response,

  Ok,
  Created,
  NoContent,

  BadRequest,
  Unauthorized,
  Forbidden,
  NotAcceptable,
  Conflict,
  PreconditionFailed,

  InternalServerError
};
