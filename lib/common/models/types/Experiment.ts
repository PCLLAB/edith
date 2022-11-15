import type { Types } from "mongoose";

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

  /** Ref to document containing experiment metadata */
  mongoDBData: IdType;

  /** Document containing collection stats and ref to collection with trial data */
  // dataCollection: string;

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
