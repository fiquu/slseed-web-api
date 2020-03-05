"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("@fiquu/lambda-http-event-handler/lib/responses");
const lambda_http_event_handler_1 = require("@fiquu/lambda-http-event-handler");
const logger_1 = require("@fiquu/logger");
const http_event_1 = __importDefault(require("../../configs/http-event"));
const log = logger_1.createLogger('HTTP /api/my-path');
/**
 * Test handler function.
 */
function handler(event) {
    const { req, res } = lambda_http_event_handler_1.createHTTPEvent(event, http_event_1.default);
    log.debug(req.headers);
    log.debug(req.params);
    log.debug(req.query);
    log.debug('Body:', req.body);
    try {
        return res.send(responses_1.noContent());
    }
    catch (err) {
        log.error('It failed...', { err });
        return res.handle(err);
    }
}
exports.default = handler;
