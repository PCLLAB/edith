import mongoose, { Types } from "mongoose";

export interface ExperimentCacheDoc<IdType = Types.ObjectId, DateType = Date> {
  _id: IdType;
  data: Types.Array<{}>;
  experiment: IdType;
  /** managed by mongoose using timestamp option */
  createdAt: DateType;
}

export interface ExperimentCacheObj
  extends Omit<ExperimentCacheDoc<string, string>, "data"> {
  data: any[];
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
