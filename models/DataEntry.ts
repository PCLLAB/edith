import mongoose, { Types } from "mongoose";

import { CachedDataEntryDoc, DataEntryDoc } from "../lib/common/models/types";
import { throwIfNull } from "../lib/server/throwIfNull";

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
  dataEntrySchema.plugin(throwIfNull("DataEntry"));
  return mongoose.model(collectionName, dataEntrySchema);
};

const CachedDataEntrySchema = new mongoose.Schema<CachedDataEntryDoc>(
  {
    ...dataEntryFormat,
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
CachedDataEntrySchema.plugin(throwIfNull("CachedDataEntry"));

export const CachedDataEntry =
  mongoose.models.CachedDataEntry ||
  mongoose.model("CachedDataEntry", CachedDataEntrySchema);
