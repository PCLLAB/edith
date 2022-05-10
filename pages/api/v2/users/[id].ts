import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import initHandler, {
  MissingArgsError,
  ModelNotFoundError,
  NextApiRequestWithAuth,
  UserPermissionError,
} from "../../../../lib/initHandler";
import User, { RawUnsafeUserDoc } from "../../../../models/User";

const get = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const user = await User.findById(req.query.id).lean();
  if (!user) {
    throw new ModelNotFoundError("User");
  }
  return res.status(200).json(user);
};

const put = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const id = req.query.id;

  if (req.auth._id !== id && !req.auth.superuser) {
    throw new UserPermissionError();
  }

  const { email, password, name, superuser } = req.body;

  if (superuser && !req.auth.superuser) {
    throw new UserPermissionError();
  }

  const user = await User.findById(id);

  // TODO this shouldn't be possible b/c existence checked in jwtAuth before handler runs
  if (!user) {
    throw new ModelNotFoundError("User");
  }

  if (email) user.email = email;
  if (password) user.password = password;
  if (name) user.name = name;
  if (superuser) user.superuser = superuser;

  await user.save();

  return res.status(200).json(user);
};

const del = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.auth.superuser) {
    throw new UserPermissionError();
  }

  const id = req.query.id;

  const deleteResult = await User.deleteOne({ _id: id });

  if (deleteResult.deletedCount) {
    return res.status(200).json({ message: "Deleted successfully" });
  }
  throw `Delete failed. No user with id: ${id}`;
};

export default initHandler({
  GET: get,
  PUT: put,
  DELETE: del,
});
