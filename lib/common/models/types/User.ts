import type { Types } from "mongoose";

export interface UserDoc<IdType = Types.ObjectId, DateType = Date> {
  _id: IdType;
  email: string;
  name: string;
  /** Admin priveleges */
  superuser: boolean;
  /** managed by mongoose using timestamp option */
  createdAt: DateType;
  /** managed by mongoose using timestamp option */
  updatedAt: DateType;
}

export interface UserJson extends UserDoc<string, string> {}

// This lets us type lean and full mongoose objects
// This is never JSONified, so DateType is always Date
export interface RawUnsafeUserDoc<T = Types.ObjectId> extends UserDoc<T> {
  password: string;
}
