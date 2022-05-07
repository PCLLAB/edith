import mongoose, { Types } from "mongoose";

export interface ScriptDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  author: Types.ObjectId;
  contents: string;
}

export interface ScriptObj extends Omit<ScriptDoc, "_id" | "author"> {
  _id: string;
  author: string;
}

const ScriptSchema = new mongoose.Schema<ScriptDoc>({
  name: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contents: { type: String, default: "" },
});

export default mongoose.models.Script || mongoose.model("Script", ScriptSchema);
