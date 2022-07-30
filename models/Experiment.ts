import mongoose, { Types } from "mongoose";
import { throwIfNull } from "../lib/throwIfNull";

/** CHANGELOG
 * Removed fields:
 *  usesMongo: number,
 *  usesSQL: boolean,
 *  project: Types.ObjectId;
 *  mongoDBData: Types.ObjectId;
 * Added:
 *  dataCollection: string, // put here instead of inside a MongoDbData document
 */

export interface ExperimentDoc<IdType = Types.ObjectId, DateType = Date> {
  _id: IdType;
  name: string;

  /** if disabled, save to communal cache, if enabled save to unique collection */
  enabled: boolean;

  /** Document containing collection stats and ref to collection with trial data */
  dataCollection: string;

  /** Experiment Owner */
  user: IdType;

  /** Comma delimited string of ancestor ids ex: "r,ABC213,BADFA123," */
  prefixPath: string;

  /** managed by mongoose using timestamp option */
  createdAt: DateType;
  /** managed by mongoose using timestamp option */
  updatedAt: DateType;
}

export interface ExperimentJson extends ExperimentDoc<string, string> {}

const ExperimentSchema = new mongoose.Schema<ExperimentDoc>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide an experiment name"],
    },
    enabled: { type: Boolean, default: false },
    dataCollection: { type: String, required: true },
    // mongoDBData: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "MongoDBData",
    //   required: true,
    // },
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
