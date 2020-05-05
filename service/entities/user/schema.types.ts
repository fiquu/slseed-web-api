import { Types, Document } from 'mongoose';

export interface UserUpdateInput {
  /**
   * The User's Cognito subject.
   */
  sub?: string;

  /**
   * The User's name.
   */
  name: string;
}

export interface UserCreateInput extends UserUpdateInput {
  sub: string;
}

export interface UserDocument extends UserCreateInput, Document {
  _id: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
