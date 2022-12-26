import type { Types } from "mongoose";

export interface ScriptDoc<IdType = Types.ObjectId> {
  _id: IdType;
  name: string;
  author: IdType;
  contents: string;
}

export interface ScriptJson extends ScriptDoc<string> {}
