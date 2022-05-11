import { NextApiResponse } from "next";
import initHandler, {
  ModelNotFoundError,
  NextApiHandlerWithAuth,
  UserPermissionError,
} from "../../../../lib/initHandler";
import User from "../../../../models/User";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const user = await User.findById(req.query.id).lean();
  if (!user) {
    throw new ModelNotFoundError("User");
  }
  return res.json(user);
};

const put: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  if (req.auth._id !== id && !req.auth.superuser) {
    throw new UserPermissionError();
  }

  const { email, password, name, superuser } = req.body;

  if (superuser && !req.auth.superuser) {
    throw new UserPermissionError();
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      email,
      password,
      name,
      superuser,
    },
    { new: true }
  );

  // TODO this shouldn't be possible b/c existence checked in jwtAuth before handler runs
  if (!user) {
    throw new ModelNotFoundError("User");
  }

  return res.json(user);
};

const del: NextApiHandlerWithAuth = async (req, res) => {
  if (!req.auth.superuser) {
    throw new UserPermissionError();
  }

  const id = req.query.id;

  const deleteResult = await User.deleteOne({ _id: id });

  if (!deleteResult.deletedCount) {
    throw new ModelNotFoundError("User");
  }
  return res.json({ message: "Deleted successfully" });
};

export default initHandler({
  GET: get,
  PUT: put,
  DELETE: del,
});
