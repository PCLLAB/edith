import type { Types } from "mongoose";

export interface DataEntryDoc<IdType = Types.ObjectId, DateType = Date> {
  /** Array of objects containing trial data from jsPsych */
  _id: IdType;
  data: Types.Array<{}>;
  /** Managed by mongoose using timestamp option */
  createdAt: Date;
}

export interface DataEntryJson
  extends Omit<DataEntryDoc<string, string>, "data"> {
  data: any[];
}

export interface CachedDataEntryDoc extends DataEntryDoc {
  experiment: Types.ObjectId;
}

export interface CachedDataEntryJson extends DataEntryJson {
  experiment: string;
}
