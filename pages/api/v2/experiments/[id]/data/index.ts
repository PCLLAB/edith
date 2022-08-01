import initHandler, {
  ModelNotFoundError,
  TypedApiHandlerWithAuth,
} from "../../../../../../lib/initHandler";
import Experiment from "../../../../../../models/Experiment";
import { modelForCollection } from "../../../../../../models/DataEntry";

const get: TypedApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();

  const DataModel = modelForCollection(expObj.dataCollection);
  const data = await DataModel.find({});

  res.json(data);
};

const post: TypedApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();

  // TODO cached data entry

  const DataModel = modelForCollection(expObj.dataCollection);
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
