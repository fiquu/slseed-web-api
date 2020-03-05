"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_db_1 = __importDefault(require("../../entities/user/schema.db"));
const schemas = new Map();
const options = {
    replace: false,
    clone: true
};
schemas.set('user', schema_db_1.default);
exports.default = { schemas, options };
