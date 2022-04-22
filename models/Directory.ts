import mongoose, { Types } from "mongoose";

interface Directory {
  name: string;
  ownerIds: Types.Array<Types.ObjectId>;
  /** Comma delimited string of ancestor ids ex: "r,ADS93,SD422" */
  prefixPath: string;
  /** Comma delimited string of ancestor names ex: "Root,Books,Programming" */
  namedPrefixPath: string;
  /** Managed by mongoose using timestamp option*/
  dateCreated: Date;
  /** Managed by mongoose using timestamp option*/
  dateUpdated: Date;
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
    dateCreated: Date,
    dateUpdated: Date,
  },
  // renamed to match old manually managed fields
  { timestamps: { createdAt: "dateCreated", updatedAt: "dateUpdated" } }
);

export default mongoose.models.Directory ||
  mongoose.model("Directory", DirectorySchema);
