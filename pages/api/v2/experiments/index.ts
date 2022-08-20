import { MissingArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Experiment, { ExperimentJson } from "../../../../models/Experiment";

export const ENDPOINT = "/api/v2/experiments";

export type ExperimentsGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  data: ExperimentJson[];
};

const get: TypedApiHandlerWithAuth<ExperimentsGetSignature> = async (
  req,
  res
) => {
  const experiments = await Experiment.find().lean();
  res.json(experiments);
};

export type ExperimentsPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  body: {
    name: string;
    prefixPath: string;
    enabled: boolean;
  };
  data: ExperimentJson;
};

const post: TypedApiHandlerWithAuth<ExperimentsPostSignature> = async (
  req,
  res
) => {
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
