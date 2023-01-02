import {
  DataEntryJson,
  Quota,
} from "../../../../../../lib/common/types/models";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../../lib/server/initHandler";
import Counterbalance from "../../../../../../models/Counterbalance";
import {
  CachedDataEntry,
  modelForCollection,
} from "../../../../../../models/DataEntry";
import Experiment from "../../../../../../models/Experiment";
import MongoDBData from "../../../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/experiments/[id]/data";

export type ExperimentsIdDataGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: DataEntryJson[];
};

const get: TypedApiHandlerWithAuth<ExperimentsIdDataGetSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();
  const meta = await MongoDBData.findById(expObj.mongoDBData).lean();

  const DataModel = modelForCollection(meta.dataCollection);
  const data = await DataModel.find();

  res.json(data);
};

export type ExperimentsIdDataPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
  };
  body: any;
  data: void;
};

const post: TypedApiHandlerWithAuth<ExperimentsIdDataPostSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const exp = await Experiment.findById(id).lean();

  const data = req.body;

  if (exp.enabled) {
    const entry = new CachedDataEntry({
      data,
      experiment: exp._id,
    });

    await entry.save();

    return res.status(204).send();
  }

  const meta = await MongoDBData.findById(exp.mongoDBData).lean();
  const DataModel = modelForCollection(meta.dataCollection);

  const entry = new DataModel({
    data,
  });
  await entry.save();

  try {
    const cb = await Counterbalance.findOne({
      experiment: exp._id,
    });

    cb.quotas.forEach((quota: Quota, index: number) => {
      const match = Object.entries(quota.params).every(
        ([param, option]) => data[0][param] === option
      );

      if (match) {
        cb.quotas[index].amount++;
      }
    });

    await cb.save();
  } catch {
    // no counterbalance for experiment, do nothing
  }

  res.status(204).send();
};

export default initHandler({
  GET: get,
  POST: post,
});
