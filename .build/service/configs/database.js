"use strict";
/**
 * Database config module.
 *
 * @see https://mongoosejs.com/docs/lambda.html
 *
 * @module configs/database
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { NODE_ENV } = process.env;
mongoose_1.default.set('debug', !['production', 'testing'].includes(NODE_ENV));
const config = {
    uri: process.env.DB_URI,
    options: {
        promiseLibrary: Promise,
        connectTimeoutMS: 3000,
        bufferCommands: false,
        useNewUrlParser: true,
        bufferMaxEntries: 0,
        autoIndex: false,
        poolSize: NODE_ENV === 'local'
            ? 10 // Allow for some concurrency while developing
            : 1 // We don't need more for each function on production environments
    }
};
exports.default = config;
