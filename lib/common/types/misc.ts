import { MongoDBDataJson } from "../../../models/MongoDBData";

export type ExperimentMeta = {
  mongoDBData: MongoDBDataJson;
  activityLog: {
    [date: string]: number;
  };
};
