import mongoose, { Types } from "mongoose";
import { throwIfNull } from "../lib/server/throwIfNull";

export interface Quota {
  amount: number;
  progress: number;
  params: { [key: string]: string };
}
export interface ParamOption {
  [key: string]: string[];
}

export interface CounterbalanceDoc<IdType = Types.ObjectId> {
  _id: IdType;
  experiment: IdType;
  /** format "&paramName=option" strings serialized as individual URL params, no need to provide */
  stack: Types.Array<string>;
  shuffleStack: boolean;
  /** URL for actual experiment, parameters will be passed as URL encoded params with ?paramA=optionA&paramB=optionB etc. */
  url: string;
  /** format { "paramName": ["A","B","C"]}, format map of arrays */
  paramOptions: ParamOption;
  quotas: Types.Array<Quota>;
  /**
   * [
   *  {
   *    "amount": 25,
   *    "progress": 14,
   *    "params": {
   *      "param1": "value",
   *      "param1": "value",
   *      "param1": "value",
   *      "param1": "value",
   *    }
   *  },
   * ...
   * ]
   */
}

export interface CounterbalanceObj
  extends Omit<CounterbalanceDoc<string>, "stack" | "quotas"> {
  stack: string[];
  quotas: Quota[];
}

const CounterbalanceSchema = new mongoose.Schema({
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
