import type { CounterbalanceJson } from "../../../../lib/common/types/models";
import { InvalidArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Counterbalance from "../../../../models/Counterbalance";
import { modelForCollection } from "../../../../models/DataEntry";
import Experiment from "../../../../models/Experiment";
import MongoDBData from "../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/counterbalances/[id]";

export type CounterbalancesIdGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: CounterbalanceJson;
};

const get: TypedApiHandlerWithAuth<CounterbalancesIdGetSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const cb = await Counterbalance.findOne({ experiment: id }).lean();

  res.json(cb);
};

export type CounterbalancesIdPutSignature = {
  url: typeof ENDPOINT;
  method: "PUT";
  query: {
    id: string;
  };
  body: Partial<CounterbalanceJson>;
  data: CounterbalanceJson;
};

const put: TypedApiHandlerWithAuth<CounterbalancesIdPutSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const cb = await Counterbalance.findOne({ experiment: id });
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
    const exp = await Experiment.findById(id).lean();
    const meta = await MongoDBData.findById(exp.mongoDBData).lean();
    const DataModel = modelForCollection(meta.dataCollection);

    // TODO test this
    cb.quotas = await Promise.all(
      quotas.map(async (quota) => {
        quota.progress = await DataModel.countDocuments({
          data: {
            $elemMatch: quota,
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
