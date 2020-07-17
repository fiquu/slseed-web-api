import { Types, Document } from 'mongoose';

export interface UserCreateInput {
  /**
   * The User's Cognito subject.
   */
  sub?: string;

  /**
   * The User's name.
   */
  name?: string;
}

export type UserUpdateInput = Partial<UserCreateInput>;

export interface UserDocument extends UserCreateInput, Document {
  _id: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
