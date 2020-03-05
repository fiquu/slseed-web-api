"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("@fiquu/lambda-http-event-handler/lib/responses");
const handlers = new Map();
handlers.set('ValidationError', responses_1.badRequest);
handlers.set('MongoError', responses_1.badRequest);
handlers.set(11000, responses_1.conflict);
const config = {
    res: {
        handlers
    }
};
exports.default = config;
