import {
  ModelNotFoundError,
  UserPermissionError,
} from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import User, { UserJson } from "../../../../models/User";

export const ENDPOINT = "/api/v2/users/[id]";

export type UsersIdGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: UserJson;
};

const get: TypedApiHandlerWithAuth<UsersIdGetSignature> = async (req, res) => {
  const user = await User.findById(req.query.id).lean();
  return res.json(user);
};

export type UsersIdPutSignature = {
  url: typeof ENDPOINT;
  method: "PUT";
  query: {
    id: string;
  };
  body: {
    email?: string;
    password?: string;
    name?: string;
    superuser?: boolean;
  };
  data: UserJson;
};

const put: TypedApiHandlerWithAuth<UsersIdPutSignature> = async (req, res) => {
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

  return res.json(user);
};

export type UsersIdDeleteSignature = {
  url: typeof ENDPOINT;
  method: "DELETE";
  query: {
    id: string;
  };
  data: {
    message: string;
  };
};

const del: TypedApiHandlerWithAuth<UsersIdDeleteSignature> = async (
  req,
  res
) => {
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
