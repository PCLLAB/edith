import mongoose from "mongoose";

/** Changelog
 * Removed fields:
 *  paramters: Array, // was never even used in frontend?
 */
export interface MongoDBData {
  sizeOnDisk: number;
  numDocuments: number;
  dataCollection: string;
  // parameters: [],
}

const MongoDBDataSchema = new mongoose.Schema<MongoDBData>({
  sizeOnDisk: { type: Number, default: 0 },
  numDocuments: { type: Number, default: 0 },
  dataCollection: { type: String, required: true },
  // parameters: Array,
});

export default mongoose.models.MongoDBData ||
  mongoose.model("MongoDBData", MongoDBDataSchema);
