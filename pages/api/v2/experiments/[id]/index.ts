import initHandler, {
  ModelNotFoundError,
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Experiment, {
  ArchivedExperiment,
} from "../../../../../models/Experiment";

// These endpoints allow any user to update any experiment
// This reflects the collaborative way this is used
// Maybe do a share, private, public thing?

const put: TypedApiHandlerWithAuth = async (req, res) => {
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

const del: TypedApiHandlerWithAuth = async (req, res) => {
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

const post: TypedApiHandlerWithAuth = async (req, res) => {
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
