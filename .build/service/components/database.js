"use strict";
/**
 * Database component module.
 *
 * @module components/database
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_manager_mongoose_1 = require("@fiquu/database-manager-mongoose");
const database_1 = __importDefault(require("../configs/database"));
const schemas_1 = __importDefault(require("./schemas"));
const db = database_manager_mongoose_1.createDatabaseManager();
db.add('default', database_1.default);
/**
 * Connects to the database and loads it's schemas.
 *
 * @param {string} name The connection name to use.
 *
 * @returns {Connection} The connection.
 */
async function connect(name = 'default') {
    const conn = await db.connect(name);
    await schemas_1.default.load(name, conn);
    return conn;
}
/**
 * Disconnects from the database.
 *
 * @param {string} name The connection name to use.
 * @param {boolean} force Whether to force disconnection.
 *
 * @returns {Promise<void>} A promise to the disconnection.
 */
function disconnect(name = 'default', force) {
    return db.disconnect(name, force);
}
exports.default = {
    disconnect,
    connect
};
