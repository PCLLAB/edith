import initHandler, {
  ModelNotFoundError,
  NextApiHandlerWithAuth,
} from "../../../../../../lib/initHandler";
import Experiment from "../../../../../../models/Experiment";
import { modelForCollection } from "../../../../../../models/experimentData";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();
  if (!expObj) {
    throw new ModelNotFoundError("Experiment");
  }

  const DataModel = modelForCollection(expObj.dataCollection);
  const data = await DataModel.find({});

  res.json(data);
};

const post: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();
  if (!expObj) {
    throw new ModelNotFoundError("Experiment");
  }

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
