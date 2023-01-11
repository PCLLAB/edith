import bcrypt from "bcrypt";
import { UnauthorizedError } from "express-jwt";

import {
  RawUnsafeUserDoc,
  UserJson,
} from "../../../../lib/common/types/models";
import {
  ModelNotFoundError,
  UserPermissionError,
} from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import User from "../../../../models/User";

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
    oldPassword?: string;
    newPassword?: string;
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

  const { email, oldPassword, newPassword, name, superuser } = req.body;

  if (!req.auth.superuser && newPassword != null) {
    if (oldPassword == null) {
      throw new UnauthorizedError("credentials_required", {
        message: "Wrong password.",
      });
    }

    const UNSAFE_USER_WITH_PASSWORD: RawUnsafeUserDoc = await User.findById(id)
      .select("+password")
      .lean();

    const { password: passwordHash, ...user } = UNSAFE_USER_WITH_PASSWORD;

    const passwordMatch = await bcrypt.compare(oldPassword, passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedError("credentials_required", {
        message: "Wrong password.",
      });
    }
  }

  if (superuser && !req.auth.superuser) {
    throw new UserPermissionError();
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      email,
      password: newPassword,
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
