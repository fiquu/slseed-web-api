"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../components/database"));
const auth_1 = __importDefault(require("../../../../components/auth"));
/**
 * Users resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {Array} The matched query results.
 */
exports.default = async (parent, params, context) => {
    try {
        const conn = await database_1.default.connect('default');
        await auth_1.default(context);
        const User = conn.model('label');
        const query = User.find();
        if (params.skip) {
            query.skip(params.skip);
        }
        if (params.limit) {
            query.limit(params.limit);
        }
        const results = await query;
        return results;
    }
    catch (err) {
        throw new Error(err);
    }
};
