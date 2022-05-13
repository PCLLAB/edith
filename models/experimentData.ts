import mongoose, { Types } from "mongoose";

export interface DataEntryDoc {
  /** Array of objects containing trial data from jsPsych */
  data: Types.Array<{}>;
  /** Managed by mongoose using timestamp option */
  createdAt: Date;
}

export interface DataEntryJson {
  data: any[];
  createdAt: string;
}

const dataEntryFormat = {
  data: {
    type: Array, // equivalent to [Schema.Types.Mixed]
    required: [true, "Please provide data for this entry"],
  },
};

/**
 * Every experiment has a unique collection based on the same schema
 * Models cannot be created statically since new experiments can be created anytime
 *
 * This uses cached models to avoid creating a model everytime
 * @param collectionName unique name of collection specific to an experiment
 * @returns mongoose model of collection
 */
export const modelForCollection = (collectionName: string) => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName] as mongoose.Model<DataEntryDoc>;
  }

  const dataEntrySchema = new mongoose.Schema<DataEntryDoc>(dataEntryFormat, {
    collection: collectionName, // sets collection name and avoids auto pluralizing
    timestamps: {
      createdAt: true,
      updatedAt: false, // disabled because a data entry is readonly
    },
  });
  return mongoose.model(collectionName, dataEntrySchema);
};
