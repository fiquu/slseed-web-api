/**
 * Notification schema module.
 *
 * @module schemas/notification
 */

const { Schema } = require('mongoose');

const CONSTS = require('../components/consts');

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
      enum: CONSTS.NOTIFICATIONS
    },

    fromModel: {
      type: String,
      required: true,
      index: true
    },

    fromId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },

    toModel: {
      type: String,
      required: true,
      index: true
    },

    toId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },

    refModel: {
      type: String,
      required: true,
      index: true
    },

    refId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },

    dismissedAt: Date
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

schema.virtual('from', {
  ref: doc => doc.fromModel,
  localField: 'fromId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('to', {
  ref: doc => doc.toModel,
  localField: 'toId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('ref', {
  ref: doc => doc.refModel,
  localField: 'refId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
