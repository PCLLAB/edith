import mongoose from "mongoose";

import { ScriptDoc } from "../lib/common/models/types";
import { throwIfNull } from "../lib/server/throwIfNull";

const ScriptSchema = new mongoose.Schema<ScriptDoc>({
  name: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contents: { type: String, default: "" },
});

ScriptSchema.plugin(throwIfNull("Script"));

export default mongoose.models.Script || mongoose.model("Script", ScriptSchema);
