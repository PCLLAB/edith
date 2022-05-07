import mongoose, { Types } from "mongoose";

/** CHANGELOG
 * Removed fields:
 *  usesMongo: number,
 *  usesSQL: boolean,
 *  project: Types.ObjectId;
 */

export interface ExperimentDoc {
  _id: mongoose.Types.ObjectId;
  name: string;

  /** if disabled, save to communal cache, if enabled save to unique collection */
  enabled: boolean;

  /** Document containing collection stats and ref to collection with trial data */
  mongoDBData: Types.ObjectId;

  /** Experiment Owner */
  user: Types.ObjectId;

  /** Comma delimited string of ancestor ids ex: "r,ABC213,BADFA123," */
  prefixPath: string;

  /** managed by mongoose using timestamp option */
  createdAt: Date;
  /** managed by mongoose using timestamp option */
  updatedAt: Date;
}

export interface ExperimentObj
  extends Omit<
    ExperimentDoc,
    "_id" | "mongoDBData" | "user" | "createdAt" | "updatedAt"
  > {
  _id: string;
  mongoDBData: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prefixPath: {
      type: String,
      default: "r",
      match: [/^r(,[A-Za-z\d\-_\s]+)*$/, "Incorrect prefixpath pattern"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Experiment ||
  mongoose.model("Experiment", ExperimentSchema);
