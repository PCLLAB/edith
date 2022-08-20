import mongoose, { Types } from "mongoose";
import { CounterbalanceDoc } from "../lib/common/models/types";
import { throwIfNull } from "../lib/server/throwIfNull";

const CounterbalanceSchema = new mongoose.Schema<CounterbalanceDoc>({
  experiment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experiment",
    required: true,
  },
  // array default is []
  stack: [String],
  shuffleStack: { type: mongoose.Schema.Types.Boolean, default: false },
  url: { type: String, default: "" },
  paramOptions: { type: mongoose.Schema.Types.Mixed, default: {} },
  // array default is []
  quotas: [mongoose.Schema.Types.Mixed],
});

CounterbalanceSchema.plugin(throwIfNull("Counterbalance"));

export default mongoose.models.Counterbalance ||
  mongoose.model("Counterbalance", CounterbalanceSchema);
