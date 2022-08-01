import initHandler, {
  MissingArgsError,
  TypedApiHandlerWithAuth,
} from "../../../../lib/initHandler";
import Experiment from "../../../../models/Experiment";

/**
 * Get All Experiments
 *
 * GET - /api/v2/experiments (Get array of experiments)
 */

export const ENDPOINT = "/api/v2/experiments";

const get: TypedApiHandlerWithAuth = async (req, res) => {
  const experiments = await Experiment.find().lean();
  res.json(experiments);
};

const post: TypedApiHandlerWithAuth = async (req, res) => {
  const { name, prefixPath, enabled } = req.body;
  const user = req.auth._id;

  if (!name) {
    throw new MissingArgsError(["name"]);
  }

  // Create a unique, human-readable collection name
  const dataCollection = `${name
    .split(" ")
    .join("_")}_${new Date().toISOString()}`.toLowerCase();

  const experiment = new Experiment({
    name,
    enabled,
    user,
    dataCollection,
    prefixPath,
  });
  await experiment.save();

  res.json(experiment);
};

export default initHandler({
  GET: get,
  POST: post,
});
