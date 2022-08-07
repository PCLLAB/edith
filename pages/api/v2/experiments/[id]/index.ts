import initHandler, {
  ModelNotFoundError,
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Experiment, {
  ArchivedExperiment,
  ExperimentJson,
} from "../../../../../models/Experiment";
import { UserJson } from "../../../../../models/User";

export const ENDPOINT = "/api/v2/experiments/[id]";
// These endpoints allow any user to update any experiment
// This reflects the collaborative way this is used
// Maybe do a share, private, public thing?

export type ExperimentsIdPutSignature = {
  url: typeof ENDPOINT;
  method: "PUT";
  query: {
    id: string;
  };
  body: {
    name?: string;
    enabled?: boolean;
    user?: UserJson;
    prefixPath?: string;
  };
  data: ExperimentJson;
};

const put: TypedApiHandlerWithAuth<ExperimentsIdPutSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const { name, enabled, user, prefixPath } = req.body;
  const experiment = await Experiment.findByIdAndUpdate(
    id,
    {
      name,
      enabled,
      user,
      prefixPath,
    },
    { new: true }
  );

  res.json(experiment);
};

export type ExperimentsIdDeleteSignature = {
  url: typeof ENDPOINT;
  method: "DELETE";
  query: {
    id: string;
  };
  data: {
    message: string;
  };
};

const del: TypedApiHandlerWithAuth<ExperimentsIdDeleteSignature> = async (
  req,
  res
) => {
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

export type ExperimentsIdPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
  };
  data: {
    message: string;
  };
};

const post: TypedApiHandlerWithAuth<ExperimentsIdPostSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const archivedExp = await ArchivedExperiment.findById(id);

  const experiment = new Experiment(archivedExp.toObject());
  await experiment.save();

  const deletedArchive = await archivedExp.delete();

  if (!deletedArchive) {
    throw `Delete failed: ${archivedExp._id}`;
  }

  return res.json({
    message: `Restored: ${archivedExp._id}`,
  });
};

export default initHandler({
  POST: post,
  PUT: put,
  DELETE: del,
});
