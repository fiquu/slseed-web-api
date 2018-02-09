/**
 * User schema module.
 *
 * @module schemas/user
 */

const { Schema } = require('mongoose');

const GENDERS = require('../consts/genders');

const schema = new Schema(
  {
    // Cognito user name (subject)
    sub: {
      type: String,
      required: true,
      unique: true
    },

    gender: {
      type: String,
      required: true,
      enum: Object.keys(GENDERS).map(key => GENDERS[key]),
      default: GENDERS.NONE
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = schema;
