import mongoose, { Types } from "mongoose";
import { throwIfNull } from "../lib/server/throwIfNull";

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

export interface DirectoryJson extends Omit<DirectoryDoc<string>, "ownerIds"> {
  ownerIds: string[];
}

export const ROOT_DIRECTORY = {
  _id: "r",
  name: "Root",
};

const arrayNotEmpty = (array: any[]) => array.length;

const DirectorySchema = new mongoose.Schema<DirectoryDoc>(
  {
    name: {
      type: String,
      required: [true, "Please provide a folder name"],
      trim: true,
    },
    ownerIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: [arrayNotEmpty, "Must have at least one owner"],
    },
    prefixPath: {
      type: String,
      default: "r",
      match: [/^r(,([a-z\d]){24})*$/, "Incorrect prefixpath pattern"],
    },
    namedPrefixPath: {
      type: String,
      default: "Root",
      match: [
        /^Root(,[A-Za-z\d\-_\s]+)*$/,
        "Incorrect namedPrefixPath pattern",
      ],
    },
  },
  { timestamps: true }
);

DirectorySchema.plugin(throwIfNull("Directory"));

export default mongoose.models.Directory ||
  mongoose.model("Directory", DirectorySchema);
