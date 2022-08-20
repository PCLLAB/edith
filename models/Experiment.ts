import mongoose from "mongoose";

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
    dataCollection: { type: String, required: true },
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
  mongoose.models.ArchivedExperiment ||
  mongoose.model("ArchivedExperiment", ExperimentSchema);

export default mongoose.models.Experiment ||
  mongoose.model("Experiment", ExperimentSchema);
