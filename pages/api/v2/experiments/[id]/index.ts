import initHandler, {
  ModelNotFoundError,
  NextApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Experiment, { Archive } from "../../../../../models/Experiment";

// These endpoints allow any user to update any experiment
// This reflects the collaborative way this is used
// Maybe do a share, private, public thing?

const put: NextApiHandlerWithAuth = async (req, res) => {
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

  if (!experiment) {
    throw new ModelNotFoundError("Experiment");
  }

  res.json(experiment);
};

const del: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const experiment = await Experiment.findById(id);

  if (!experiment) {
    throw new ModelNotFoundError("Experiment");
  }

  const archivedExp = new Archive(experiment.toObject());
  await archivedExp.save();

  const deletedExp = await experiment.delete();

  if (!deletedExp) {
    throw `Delete failed: ${experiment._id}`;
  }

  return res.json({
    message: `Archived: ${experiment._id}`,
  });
};

export default initHandler({
  PUT: put,
  DELETE: del,
});
