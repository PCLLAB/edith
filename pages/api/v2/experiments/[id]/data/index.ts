import { DataEntryJson } from "../../../../../../lib/common/types/models";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../../lib/server/initHandler";
import { modelForCollection } from "../../../../../../models/DataEntry";
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
  const data = await DataModel.find({});

  res.json(data);
};

export type ExperimentsIdDataPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
  };
  body: any;
  data: {
    message: string;
  };
};

const post: TypedApiHandlerWithAuth<ExperimentsIdDataPostSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();

  const meta = await MongoDBData.findById(expObj.mongoDBData).lean();

  // TODO cached data entry
  const DataModel = modelForCollection(meta.dataCollection);

  const entry = new DataModel({
    data: req.body,
  });
  await entry.save();

  //TODO do other stuff here
  //FIXME hi
  // update counterbalance/quotas

  res.json({ message: `Saved data: ${id}` });
  // TODO this is hard
};

export default initHandler({
  GET: get,
  POST: post,
});
