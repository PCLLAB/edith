import initHandler, {
  ModelNotFoundError,
  NextApiHandlerWithAuth,
  UserPermissionError,
} from "../../../../../lib/initHandler";
import Experiment, { Archive } from "../../../../../models/Experiment";

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

  if (req.auth._id !== experiment.user.toString() && !req.auth.superuser) {
    throw new UserPermissionError();
  }

  const archivedExp = new Archive(experiment.toObject());
  await archivedExp.save();

  const deleteResult = await Experiment.deleteOne({ _id: id });

  if (!deleteResult.deletedCount) {
    throw new ModelNotFoundError("Experiment");
  }

  return res.json({ message: "Successfully archived experiment" });
};

export default initHandler({
  PUT: put,
  DELETE: del,
});
