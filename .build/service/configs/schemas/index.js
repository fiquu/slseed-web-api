"use strict";
/**
 * Schemas config module.
 *
 * @module configs/schemas
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = __importDefault(require("./default"));
const config = new Map();
config.set('default', default_1.default);
exports.default = config;
