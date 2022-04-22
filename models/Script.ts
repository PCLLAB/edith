import mongoose, { Types } from "mongoose";

export interface Script {
  name: string;
  author: Types.ObjectId;
  contents: string;
}

const ScriptSchema = new mongoose.Schema<Script>({
  name: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contents: { type: String, default: "" },
});

export default mongoose.models.Script || mongoose.model("Script", ScriptSchema);
