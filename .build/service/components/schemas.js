"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Schemas Component module.
 *
 * @module components/schemas
 */
const schema_loader_mongoose_1 = require("@fiquu/schema-loader-mongoose");
const schemas_1 = __importDefault(require("../configs/schemas"));
/**
 * Loads all schemas into the default database connection.
 *
 * @param {Connection} conn The connection to load into.
 */
function load(name = 'default', conn) {
    const { schemas, options } = schemas_1.default.get(name);
    const loader = schema_loader_mongoose_1.createSchemaLoader(conn, options);
    loader.loadAll(schemas);
}
exports.default = { load };
