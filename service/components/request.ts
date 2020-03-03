/**
 * Request Component module.
 *
 * @module components/request
 */

import { Response, InternalServerError } from './responses';
import db from './database';

import config from '../configs/request';

/**
 * Request handler class.
 *
 * @class Request
 */
class Request {
  event = null;
  db = null;

  /**
   * Creates an instance of Request.
   *
   * @param {Object} event Request event object.
   *
   * @memberof Request
   */
  constructor(event) {
    if (!(event instanceof Object)) {
      throw new Error('Event must be an object!');
    }

    this.event = event;
    this.db = db;
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

      for (let key of Object.keys(this.event.headers)) {
        headers[key.toLowerCase()] = this.event.headers[key];
      }

      if (!name) {
        return headers;
      }

      return headers[String(name).toLowerCase()];
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
  async send(res) {
    await this.db.disconnect();

    /* Process empty responses as Internal Server Error (500) */
    if (!res) {
      console.error(new Error('Response is undefined!'));
      return new InternalServerError();
    }

    /* Send response if it's an instance of Response */
    if (res instanceof Response) {
      return res;
    }

    console.warn('Handling request error:');
    console.error(res);

    const handlers = config.get('handlers');

    /* Handle known object names */
    if (handlers && res.name && handlers.has(res.name)) {
      return new handlers.get(res.name)();
    }

    /* Handle known object codes */
    if (handlers && res.code && handlers.has(res.code)) {
      return new handlers.get(res.code)();
    }

    /* Process generic Error response objects as Internal Server Error (500) */
    if (res instanceof Error) {
      return new InternalServerError();
    }

    /* Process unknown response objects as Internal Server Error (500) */
    return new InternalServerError();
  }
}

export default Request;
