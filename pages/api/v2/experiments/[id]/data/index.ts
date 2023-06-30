import {
  DataEntryJson,
  Quota,
} from "../../../../../../lib/common/types/models";
import initHandler, {
  ApiHandler,
} from "../../../../../../lib/server/initHandler";
import Counterbalance from "../../../../../../models/Counterbalance";
import {
  CachedDataEntry,
  modelForCollection,
} from "../../../../../../models/DataEntry";
import Experiment from "../../../../../../models/Experiment";
import MongoDBData from "../../../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/experiments/[id]/data";

export type GetExperimentsIdData = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
    skip?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  };
  data: DataEntryJson[];
};

const GET: ApiHandler<GetExperimentsIdData> = async (req, res) => {
  const { id, skip, limit, startDate, endDate } = req.query;

  const expObj = await Experiment.findById(id).lean();
  const meta = await MongoDBData.findById(expObj.mongoDBData).lean();

  const DataModel = modelForCollection(meta.dataCollection);

  let query = DataModel.find().sort({ createdAt: "asc" });

  if (skip) query = query.skip(skip);
  if (limit) query = query.limit(limit);
  // @ts-ignore gte() works with date strings
  if (startDate) query = query.where("createdAt").gte(startDate);
  // @ts-ignore gte() works with date strings
  if (endDate) query = query.where("createdAt").lte(endDate);

  const data = await query.lean();

  res.json(data);
};

export type PostExperimentsIdData = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
  };
  body: any;
  data: void;
};

const POST: ApiHandler<PostExperimentsIdData> = async (req, res) => {
  const id = req.query.id;

  const exp = await Experiment.findById(id).lean();

  const data = req.body;

  if (!exp.enabled) {
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
  GET,
  POST,
});
