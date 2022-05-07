import mongoose, { Types } from "mongoose";

export interface ExperimentCacheDoc {
  _id: mongoose.Types.ObjectId,
  data: Types.Array<{}>;
  experiment: Types.ObjectId;
  /** managed by mongoose using timestamp option */
  createdAt: Date;
}

export interface ExperimentCacheObj {
  _id: string;
  data: any[];
  experiment: string;
  createdAt: string;
}

const ExperimentCacheSchema = new mongoose.Schema<ExperimentCacheDoc>(
  {
    data: Array,
    experiment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experiment",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false, // disabled because a data entry is readonly
    },
  }
);

export default mongoose.models.ExperimentCache ||
  mongoose.model("ExperimentCache", ExperimentCacheSchema);
