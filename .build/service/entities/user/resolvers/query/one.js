"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../components/database"));
const auth_1 = __importDefault(require("../../../../components/auth"));
/**
 * Labels resolver function.
 *
 * @param {object} parent The GraphQL parent.
 * @param {object} params The GraphQL query params.
 * @param {object} context The request context.
 *
 * @returns {object} The matched query results.
 */
exports.default = async (parent, params, context) => {
    try {
        const conn = await database_1.default.connect('default');
        await auth_1.default(context);
        const User = conn.model('user');
        const query = User.findOne()
            .where('_id').equals(params._id)
            .select({
            sub: true
        });
        const result = await query;
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
};
