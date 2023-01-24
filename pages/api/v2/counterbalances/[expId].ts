import type {
  CounterbalanceJson,
  ParamOption,
  Quota,
} from "../../../../lib/common/types/models";
import { InvalidArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Counterbalance from "../../../../models/Counterbalance";
import { modelForCollection } from "../../../../models/DataEntry";
import Experiment from "../../../../models/Experiment";
import MongoDBData from "../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/counterbalances/[expId]";

export type CounterbalancesExpIdGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: CounterbalanceJson;
};

const get: TypedApiHandlerWithAuth<CounterbalancesExpIdGetSignature> = async (
  req,
  res
) => {
  const expId = req.query.expId;

  const cb = await Counterbalance.findOne({ experiment: expId }).lean();

  res.json(cb);
};

export type CounterbalancesExpIdPutSignature = {
  url: typeof ENDPOINT;
  method: "PUT";
  query: {
    id: string;
  };
  body: {
    shuffleStack?: boolean;
    url?: string;
    paramOptions?: ParamOption;
    quotas?: Omit<Quota, "progress">[];
  };
  data: CounterbalanceJson;
};

const put: TypedApiHandlerWithAuth<CounterbalancesExpIdPutSignature> = async (
  req,
  res
) => {
  const expId = req.query.expId;

  const cb = await Counterbalance.findOne({ experiment: expId });
  const { shuffleStack, url, paramOptions, quotas } = req.body;

  if (paramOptions != null || quotas != null) {
    const rawParams = paramOptions ?? cb.paramOptions;
    const rawQuotas = quotas ?? cb.quotas;

    for (const rawQuota of rawQuotas) {
      const valid = Object.entries(rawQuota.params).every(([param, option]) =>
        rawParams[param]?.includes(option)
      );

      if (!valid) {
        throw new InvalidArgsError(
          // @ts-ignore: filter falsy
          [!paramOptions && "paramOptions", !quotas && "quotas"].filter(Boolean)
        );
      }
    }
  }

  if (shuffleStack) cb.shuffleStack = shuffleStack;
  if (url) cb.url = url;
  if (paramOptions) cb.paramOptions = paramOptions;
  if (quotas) {
    const exp = await Experiment.findById(expId).lean();
    const meta = await MongoDBData.findById(exp.mongoDBData).lean();
    const DataModel = modelForCollection(meta.dataCollection);

    // TODO test this
    cb.quotas = await Promise.all(
      quotas.map(async (quota) => {
        // @ts-ignore adding progress back
        quota.progress = await DataModel.countDocuments({
          data: {
            $elemMatch: quota.params,
          },
        });
        return quota;
      })
    );
  }

  await cb.save();

  res.json(cb);
};

export default initHandler({
  GET: get,
  PUT: put,
});
