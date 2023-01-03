import { MongoDBDataJson } from "../../../models/MongoDBData";

export type MetadataJson = {
  mongoDBData: MongoDBDataJson;
  activityLog: {
    [date: string]: number;
  };
};
