import mongoose, { Types } from "mongoose";

/**
 * CHANGELOG
 * removed user field because completely unused, there are no documents with this field in the collection
 *
 */

export interface LogEntry {
  url: string;
  method: string;
  action: string;
  ip: string;
  experiment: Types.ObjectId;
  /** managed by mongoose using timestamp option */
  timestamp: Date;
}

const logEntrySchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    method: { type: String, default: "" },
    action: { type: String, default: "" },
    ip: { type: String, default: "" },
    experiment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experiment",
      required: true,
    },
    timestamp: Date,
  },
  {
    timestamps: {
      // renamed to match old manually managed fields
      createdAt: "timestamp",
      updatedAt: false,
    },
  }
);

export default mongoose.models.LogEntry ||
  mongoose.model("LogEntry", logEntrySchema);
