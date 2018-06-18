/**
 * User schema module.
 *
 * @module schemas/user
 */

const { Schema } = require('mongoose');

const schema = new Schema(
  {
    // For translations
    tag: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = schema;
