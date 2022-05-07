import mongoose, { Types } from "mongoose";

export interface DirectoryDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  ownerIds: Types.Array<Types.ObjectId>;
  /** Comma delimited string of ancestor ids ex: "r,ADS93,SD422" */
  prefixPath: string;
  /** Comma delimited string of ancestor names ex: "Root,Books,Programming" */
  namedPrefixPath: string;
  /** Managed by mongoose using timestamp option*/
  createdAt: Date;
  /** Managed by mongoose using timestamp option*/
  updatedAt: Date;
}

export interface DirectoryObj
  extends Omit<DirectoryDoc, "_id" | "ownerIds" | "createdAt" | "updatedAt"> {
  _id: string;
  ownerIds: string[];
  createdAt: string;
  updatedAt: string;
}

const arrayNotEmpty = (array: any[]) => array.length;

const DirectorySchema = new mongoose.Schema(
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
      match: [/^r(,[A-Za-z\d\-_\s]+)*$/, "Incorrect prefixpath pattern"],
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

export default mongoose.models.Directory ||
  mongoose.model("Directory", DirectorySchema);
