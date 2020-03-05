"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const graphql_1 = require("../../components/graphql");
/**
 * Document create handler function.
 *
 * @param {object} event Call event object.
 * @param {object} context Context object.
 * @param {Function} callback Callback function.
 */
function handler(event, context, callback) {
    const { graphqlHandler } = new graphql_yoga_1.GraphQLServerLambda({
        context: () => event,
        resolvers: { ...graphql_1.resolvers },
        typeDefs: String(graphql_1.typeDefs)
    });
    // Can't use async because it would call the callback twice.
    graphqlHandler(event, context, callback);
}
exports.handler = handler;
