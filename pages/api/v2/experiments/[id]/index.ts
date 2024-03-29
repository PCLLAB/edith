import { ExperimentJson } from "../../../../../lib/common/types/models";
import initHandler, { ApiHandler } from "../../../../../lib/server/initHandler";
import Experiment, {
  ArchivedExperiment,
} from "../../../../../models/Experiment";

export const ENDPOINT = "/api/v2/experiments/[id]";
// These endpoints allow any user to update any experiment
// This reflects the collaborative way this is used
// Maybe do a share, private, public thing?

export type GetExperimentsId = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: ExperimentJson;
};

const GET: ApiHandler<GetExperimentsId> = async (req, res) => {
  const id = req.query.id;

  const experiment = await Experiment.findById(id).lean();

  res.json(experiment);
};

export type PutExperimentsId = {
  url: typeof ENDPOINT;
  method: "PUT";
  query: {
    id: string;
  };
  body: {
    name?: string;
    enabled?: boolean;
    user?: string;
    directory?: string;
  };
  data: ExperimentJson;
};

const PUT: ApiHandler<PutExperimentsId> = async (req, res) => {
  const id = req.query.id;

  const { name, enabled, user, directory } = req.body;
  const experiment = await Experiment.findByIdAndUpdate(
    id,
    {
      name,
      enabled,
      user,
      directory,
    },
    { new: true }
  ).lean();

  res.json(experiment);
};

export type DeleteExperimentsId = {
  url: typeof ENDPOINT;
  method: "DELETE";
  query: {
    id: string;
  };
  data: {
    message: string;
  };
};

const DELETE: ApiHandler<DeleteExperimentsId> = async (req, res) => {
  const id = req.query.id;

  const experiment = await Experiment.findById(id);

  const archivedExp = new ArchivedExperiment(experiment.toObject());
  await archivedExp.save();

  const deletedExp = await experiment.delete();

  if (!deletedExp) {
    throw `Delete failed: ${experiment._id}`;
  }

  return res.json({
    message: `Archived: ${experiment._id}`,
  });
};

export type PostExperimentsId = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
  };
  data: {
    message: string;
  };
};

const POST: ApiHandler<PostExperimentsId> = async (req, res) => {
  const id = req.query.id;

  const archivedExp = await ArchivedExperiment.findById(id);

  const experiment = new Experiment(archivedExp.toObject());
  await experiment.save();

  const deletedArchive = await archivedExp.delete();

  if (!deletedArchive) {
    throw `Delete failed: ${archivedExp._id}`;
  }

  res.json({
    message: `Restored: ${archivedExp._id}`,
  });
};

export default initHandler({
  GET,
  POST,
  PUT,
  DELETE,
});
