"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = __importDefault(require("./mutation/create"));
const update_1 = __importDefault(require("./mutation/update"));
const many_1 = __importDefault(require("./query/many"));
const one_1 = __importDefault(require("./query/one"));
exports.default = {
    Query: {
        users: many_1.default,
        user: one_1.default
    },
    Mutation: {
        create: create_1.default,
        update: update_1.default
    }
};
