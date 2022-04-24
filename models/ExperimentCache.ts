import mongoose, { Types } from "mongoose";

export interface IExperimentCache {
  data: Types.Array<{}>;
  experiment: Types.ObjectId;
  /** managed by mongoose using timestamp option */
  dateCreated: Date;
}

const ExperimentCacheSchema = new mongoose.Schema<IExperimentCache>(
  {
    data: Array,
    experiment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experiment",
      required: true,
    },
    dateCreated: Date,
  },
  {
    timestamps: {
      createdAt: "dateCreated", // rename to match legacy field
      updatedAt: false, // disabled because a data entry is readonly
    },
  }
);

export default mongoose.models.ExperimentCache ||
  mongoose.model("ExperimentCache", ExperimentCacheSchema);
