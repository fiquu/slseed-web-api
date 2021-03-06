import { Schema } from 'mongoose';
import is from '@fiquu/is';

const schema = new Schema({
  // Cognito user name reference (subject)
  sub: {
    type: String,
    validate: is.uuid,
    required: true,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 1
  }
}, {
  timestamps: true,
  versionKey: false
});

export default schema;
