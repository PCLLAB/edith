import mongoose, { Types } from "mongoose";

export interface ScriptDoc<IdType = Types.ObjectId> {
  _id: IdType;
  name: string;
  author: IdType;
  contents: string;
}

export interface ScriptObj extends ScriptDoc<string> {}

const ScriptSchema = new mongoose.Schema<ScriptDoc>({
  name: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contents: { type: String, default: "" },
});

export default mongoose.models.Script || mongoose.model("Script", ScriptSchema);
