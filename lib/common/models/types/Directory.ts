import type { Types } from "mongoose";
import { ExperimentJson } from "./Experiment";

export interface DirectoryDoc<IdType = Types.ObjectId, DateType = Date> {
  _id: IdType;
  name: string;
  ownerIds: Types.Array<IdType>;
  /** Comma delimited string of ancestor ids ex: "r,ADS93,SD422" */
  prefixPath: string;
  /** Comma delimited string of ancestor names ex: "Root,Books,Programming" */
  namedPrefixPath: string;
  /** Managed by mongoose using timestamp option*/
  createdAt: DateType;
  /** Managed by mongoose using timestamp option*/
  updatedAt: DateType;
}

export interface DirectoryJson
  extends Omit<DirectoryDoc<string, string>, "ownerIds"> {
  ownerIds: string[];
}

export type RootDirectory = {
  _id: "r";
  name: "Root";
};

export type AnyDirectory = DirectoryDoc | DirectoryJson | RootDirectory;

export type DirectoryFile = DirectoryJson | ExperimentJson;
