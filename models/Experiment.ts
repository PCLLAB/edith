import mongoose, { mongo } from "mongoose";

import { ExperimentDoc } from "../lib/common/models/types";
import { throwIfNull } from "../lib/server/throwIfNull";

const ExperimentSchema = new mongoose.Schema<ExperimentDoc>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide an experiment name"],
    },
    enabled: { type: Boolean, default: false },
    mongoDBData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MongoDBData",
      required: true,
    },
    // TODO consider removing mongoDBData
    // dataCollection: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prefixPath: {
      type: String,
      default: "r",
      match: [/^r(,([a-z\d]){24})*$/, "Incorrect prefixpath pattern"],
    },
  },
  {
    timestamps: true,
  }
);

ExperimentSchema.plugin(throwIfNull("Experiment"));

export const ArchivedExperiment =
  /** This is the legacy collection name from Jarvis v1.
   * Feel free to rename once fully migrated off Jarvis web app. */
  mongoose.models.Archive || mongoose.model("Archive", ExperimentSchema);

export default mongoose.models.Experiment ||
  mongoose.model("Experiment", ExperimentSchema);
