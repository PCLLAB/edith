import initHandler, {
  NextApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import ExperimentCache from "../../../../../models/ExperimentCache";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
  const data = await ExperimentCache.find({ experiment: id });

  res.json(data);
};

const del: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
  const deleteResult = await ExperimentCache.deleteMany({ experiment: id });

  res.json({ message: `Deleted ${deleteResult.deletedCount}: ${id}` });
};

export default initHandler({
  GET: get,
  DELETE: del,
});
