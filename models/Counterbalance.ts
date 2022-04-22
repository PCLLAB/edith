import mongoose, { Types } from "mongoose";

export interface Quota {
  amount: number;
  progress: number;
  params: { [key: string]: string };
}
export interface ParamOption {
  [key: string]: string[];
}

export interface Counterbalance {
  experiment: Types.ObjectId;
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

export default mongoose.models.Counterbalance ||
  mongoose.model("Counterbalance", CounterbalanceSchema);
