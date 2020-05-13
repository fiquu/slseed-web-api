import { Types, Document } from 'mongoose';

export interface UserUpdateInput {
  /**
   * The User's Cognito subject.
   */
  sub?: string;

  /**
   * The User's name.
   */
  name?: string;
}

type UserCreateInput = Required<UserUpdateInput>;

export interface UserDocument extends UserCreateInput, Document {
  _id: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
