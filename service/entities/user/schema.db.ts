import { Schema } from 'mongoose';

const schema = new Schema(
  {
    // Cognito user name (subject)
    sub: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default schema;
