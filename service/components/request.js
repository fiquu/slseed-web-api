/**
 * Request handler component.
 *
 * @module components/request
 */

const { Response, InternalServerError } = require('./responses');
const Database = require('./database');

const config = require('../configs/request');

/**
 * Request handler class.
 *
 * @class Request
 */
module.exports = class Request {
  /**
   * Creates an instance of Request.
   *
   * @param {Function} callback The Lambda callback function.
   *
   * @memberof Request
   */
  constructor(event, context, callback) {
    if (!(callback instanceof Function)) {
      throw new Error('Callback must be a function!');
    }

    if (!(event instanceof Object)) {
      throw new Error('Event must be an object!');
    }

    this.callback = callback;
    this.context = context;
    this.event = event;
    this.db = null;
  }

  /**
   * Initializes the database connection.
   *
   * @return {Promise} Connection promise.
   */
  initDb() {
    this.db = new Database();
    return this.db.connect();
  }

  /**
   * Retrieves a header value or the whole headers object from the event object.
   *
   * @param {String} name The header name or empty for the full object.
   *
   * @returns {Mixed} The header value or the headers object.
   *
   * @memberof Request
   */
  getHeader(name) {
    try {
      const headers = {};

      Object.keys(this.event.headers).forEach(key => {
        headers[key.toLowerCase()] = this.event.headers[key];
      });

      if (!name) {
        return headers;
      }

      return headers[String(name).toLowerCase()];
    } catch (e) {
      return null;
    }
  }

  /**
   * Retrieves a query parameter or the whole query object from the event
   *  object.
   *
   * @param {String} prop The query parameter name or empty for the full object.
   *
   * @returns {Mixed} The query parameter value or the query object.
   *
   * @memberof Request
   */
  getQuery(prop) {
    try {
      if (!prop) {
        return this.event.queryStringParameters;
      }

      return this.event.queryStringParameters[prop];
    } catch (e) {
      return null;
    }
  }

  /**
   * Retrieves a route parameter from the request event object.
   *
   * @param {String} prop The request parameter name.
   *
   * @returns {Mixed} The route parameter value.
   *
   * @memberof Request
   */
  getParam(prop) {
    try {
      if (!prop) {
        return this.event.pathParameters;
      }

      return this.event.pathParameters[prop];
    } catch (e) {
      return null;
    }
  }

  /**
   * Parses the request body if any.
   *
   * @returns {Mixed} The parsed JSON request body.
   *
   * @memberof Request
   */
  getBody() {
    try {
      return JSON.parse(this.event.body);
    } catch (ex) {
      console.log(this.event.body);
      console.error(ex);

      return null;
    }
  }

  /**
   * Retrieves the authorization Monitor object.
   *
   * @return {Object} The Monitor object.
   */
  getAuthData() {
    try {
      return JSON.parse(this.event.requestContext.authorizer.data);
    } catch (ex) {
      return null;
    }
  }

  /**
   * Sends a response to the request.
   *
   * @param {Error|Response|Object} res The response object to send.
   *
   * @memberof Request
   */
  send(res) {
    if (this.db) {
      this.db.disconnect();
    }

    /* Process empty responses as Internal Server Error (500) */
    if (!res) {
      this.callback(null, new InternalServerError());
      console.error('Response is undefined!');
      return;
    }

    /* Send response if it's an instance of Response */
    if (res instanceof Response) {
      this.callback(null, res);
      return;
    }

    console.warn('Handling response error:');
    console.warn(res);

    /* Handle known object names */
    if (config.handlers && res.name && config.handlers[res.name]) {
      this.callback(null, new config.handlers[res.name]());
      return;
    }

    /* Handle known object codes */
    if (config.handlers && res.code && config.handlers[res.code]) {
      this.callback(null, new config.handlers[res.code]());
      return;
    }

    /* Process generic Error response objects as Internal Server Error (500) */
    if (res instanceof Error) {
      this.callback(null, new InternalServerError());
      return;
    }

    /* Process unknown response objects as Internal Server Error (500) */
    this.callback(null, new InternalServerError(res.body, res.headers));
  }
};
