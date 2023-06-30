import { DataEntryJson } from "../../../../../../../lib/common/types/models";
import initHandler, {
  ApiHandler,
} from "../../../../../../../lib/server/initHandler";
import {
  CachedDataEntry,
  modelForCollection,
} from "../../../../../../../models/DataEntry";
import Experiment from "../../../../../../../models/Experiment";
import MongoDBData from "../../../../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/experiments/[id]/data/[dataId]";

export type GetExperimentsIdDataId = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
    dataId: string;
  };
  data: DataEntryJson;
};

const GET: ApiHandler<GetExperimentsIdDataId> = async (req, res) => {
  const { id, dataId } = req.query;

  const expObj = await Experiment.findById(id).lean();
  const meta = await MongoDBData.findById(expObj.mongoDBData).lean();

  const DataModel = modelForCollection(meta.dataCollection);

  const data = await DataModel.findById(dataId).lean();

  res.json(data!);
};

export type DeleteExperimentsIdDataId = {
  url: typeof ENDPOINT;
  method: "DELETE";
  query: {
    id: string;
    dataId: string;
  };
  data: void;
};

const DELETE: ApiHandler<DeleteExperimentsIdDataId> = async (req, res) => {
  const { id, dataId } = req.query;

  const expObj = await Experiment.findById(id).lean();
  const meta = await MongoDBData.findById(expObj.mongoDBData).lean();

  const DataModel = modelForCollection(meta.dataCollection);

  const entry = await DataModel.findByIdAndDelete(dataId).lean();

  const cacheEntry = new CachedDataEntry({ ...entry, experiment: id });
  await cacheEntry.save();

  res.status(204).send();
};

export type PostExperimentsIdDataId = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
    dataId: string;
  };
  data: void;
};

const POST: ApiHandler<PostExperimentsIdDataId> = async (req, res) => {
  const { id, dataId } = req.query;

  const expObj = await Experiment.findById(id).lean();
  const meta = await MongoDBData.findById(expObj.mongoDBData).lean();

  const cacheEntry = await CachedDataEntry.findByIdAndDelete(dataId).lean();
  const DataModel = modelForCollection(meta.dataCollection);

  const { _: experiment, ...entry } = cacheEntry;
  const dataEntry = new DataModel(entry);

  await dataEntry.save();

  res.status(204).send();
};

export default initHandler({
  GET,
  DELETE,
  POST,
});
