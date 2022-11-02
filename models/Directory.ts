import mongoose from "mongoose";

import { DirectoryDoc } from "../lib/common/models/types";
import { throwIfNull } from "../lib/server/throwIfNull";

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
  },
  { timestamps: true }
);

DirectorySchema.plugin(throwIfNull("Directory"));

export default mongoose.models.Directory ||
  mongoose.model("Directory", DirectorySchema);
