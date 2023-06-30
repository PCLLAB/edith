import { CounterbalanceDoc } from "../../../../lib/common/types/models";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Counterbalance from "../../../../models/Counterbalance";

export const ENDPOINT = "/api/v2/assign/[expId]";

export type GetAssignExpId = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: void;
};

const GET: TypedApiHandlerWithAuth<GetAssignExpId> = async (req, res) => {
  const expId = req.query.expId;
  const cb: CounterbalanceDoc = await Counterbalance.findOne({
    experiment: expId,
  }).lean();

  const weightedParamOptions = new Map();

  cb.quotas.forEach((quota) => {
    if (quota.progress >= quota.amount) return;

    Object.entries(quota.params).forEach(([param, value]) => {
      if (weightedParamOptions.has(param)) {
        weightedParamOptions.get(param).push(value);
      } else {
        weightedParamOptions.set(param, [value]);
      }
    });
  });

  const paramValues = Object.keys(cb.paramOptions).map((param) => {
    const options = weightedParamOptions.has(param)
      ? weightedParamOptions.get(param)
      : cb.paramOptions[param];

    const value = options[Math.floor(Math.random() * options.length)];

    return `${param}=${value}`;
  });

  const url = `${cb.url}?${paramValues.join("&")}`;

  res.redirect(url);
};

export default initHandler({
  GET,
});
