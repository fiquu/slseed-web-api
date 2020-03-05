"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_graphql_schemas_1 = require("merge-graphql-schemas");
const path_1 = require("path");
const typesGlob = path_1.join('service', 'entity', '**', '*.graphql');
exports.default = merge_graphql_schemas_1.fileLoader(typesGlob, {
    recursive: true
});
