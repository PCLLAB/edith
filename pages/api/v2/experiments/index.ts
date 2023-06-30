import { ExperimentJson } from "../../../../lib/common/types/models";
import { MissingArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Experiment from "../../../../models/Experiment";
import MongoDBData from "../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/experiments";

export type GetExperiments = {
  url: typeof ENDPOINT;
  method: "GET";
  data: ExperimentJson[];
};

const GET: TypedApiHandlerWithAuth<GetExperiments> = async (req, res) => {
  const experiments = await Experiment.find().lean();
  res.json(experiments);
};

export type PostExperiments = {
  url: typeof ENDPOINT;
  method: "POST";
  body: {
    name: string;
    directory: string;
    enabled?: boolean;
  };
  data: ExperimentJson;
};

const POST: TypedApiHandlerWithAuth<PostExperiments> = async (req, res) => {
  const { name, directory, enabled = false } = req.body;
  const user = req.auth._id;

  if (!name) {
    throw new MissingArgsError(["name"]);
  }

  // Create a unique, human-readable collection name
  const dataCollection = `${name
    .split(" ")
    .join("_")}_${new Date().toISOString()}`.toLowerCase();

  const mongoDBData = new MongoDBData({
    dataCollection,
  });

  await mongoDBData.save();

  const experiment = new Experiment({
    name,
    enabled,
    user,
    mongoDBData: mongoDBData._id,
    directory,
  });
  await experiment.save();

  res.json(experiment);
};

export default initHandler({
  GET,
  POST,
});
