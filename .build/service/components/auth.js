"use strict";
/**
 * Auth component module.
 *
 * @module components/auth
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_path_1 = __importDefault(require("object-path"));
const fi_is_1 = __importDefault(require("fi-is"));
const database_1 = __importDefault(require("./database"));
const auth_1 = __importDefault(require("../configs/auth"));
/**
 * Authorizes the request user if required.
 *
 * @param {APIGatewayProxyEvent} context The request event context.
 *
 * @returns {object|null} The user data or null if not required and no subject
 * is present.
 *
 * @throws ERR_NO_AUTH_SUBJECT If there's no subject to authorize.
 * @throws ERR_NO_AUTH_DATA If the provided subject has no data registered.
 */
exports.default = async (context) => {
    const sub = object_path_1.default.get(context, 'requestContext.authorizer.claims.sub', {});
    const conn = await database_1.default.connect('default');
    if (fi_is_1.default.empty(sub)) {
        throw 'ERR_NO_AUTH_SUBJECT';
    }
    const pipeline = auth_1.default.get('pipeline');
    const model = auth_1.default.get('model');
    const query = conn.model(model).aggregate();
    query.match({ sub });
    if (fi_is_1.default.array(pipeline) && fi_is_1.default.not.empty(pipeline)) {
        query.append(pipeline);
    }
    const [result] = await query;
    if (fi_is_1.default.any.empty(result, result._id)) {
        throw 'ERR_NO_AUTH_DATA_FOUND';
    }
    return result;
};
