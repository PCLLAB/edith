import mongoose, { Types } from "mongoose";

/**
  * CONSIDER REMOVING THIS, what point does it serve at all?
 * CHANGELOG
 * removed user field because completely unused, there are no documents with this field in the collection
 *
 */

export interface LogEntryDoc<T=Types.ObjectId> {
  url: string;
  method: string;
  action: string;
  ip: string;
  experiment: T;
  /** managed by mongoose using timestamp option */
  createdAt: Date;
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
  },
  {
    timestamps: {
      // renamed to match old manually managed fields
      createdAt: true,
      updatedAt: false,
    },
  }
);

export default mongoose.models.LogEntry ||
  mongoose.model("LogEntry", logEntrySchema);
