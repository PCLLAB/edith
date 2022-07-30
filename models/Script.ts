import mongoose, { Types } from "mongoose";
import { throwIfNull } from "../lib/throwIfNull";

export interface ScriptDoc<IdType = Types.ObjectId> {
  _id: IdType;
  name: string;
  author: IdType;
  contents: string;
}

export interface ScriptJson extends ScriptDoc<string> {}

const ScriptSchema = new mongoose.Schema<ScriptDoc>({
  name: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contents: { type: String, default: "" },
});

ScriptSchema.plugin(throwIfNull("Script"));

export default mongoose.models.Script || mongoose.model("Script", ScriptSchema);
