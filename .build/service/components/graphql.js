"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_graphql_schemas_1 = require("merge-graphql-schemas");
const resolvers_1 = __importDefault(require("../configs/resolvers"));
const type_defs_1 = __importDefault(require("../configs/type-defs"));
exports.typeDefs = merge_graphql_schemas_1.mergeTypes(type_defs_1.default, {
    all: true
});
exports.resolvers = merge_graphql_schemas_1.mergeResolvers(resolvers_1.default);
