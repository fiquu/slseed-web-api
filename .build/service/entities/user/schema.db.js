"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    // Cognito user name (subject)
    sub: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = schema;
