import { Types, Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  _id: Types.ObjectId;

  /**
   * The User's Cognito subject.
   */
  sub: string;

  /**
   * The User's name.
   */
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema({
  // Cognito user name reference (subject)
  sub: {
    type: String,
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
