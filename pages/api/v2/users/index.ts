import { UserJson } from "../../../../lib/common/types/models";
import {
  MissingArgsError,
  UserPermissionError,
} from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import User from "../../../../models/User";

export const ENDPOINT = "/api/v2/users";

export type UsersGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  data: UserJson[];
};

const get: TypedApiHandlerWithAuth<UsersGetSignature> = async (req, res) => {
  const users = await User.find().lean();
  return res.json(users);
};

export type UsersPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  body: { email: string; superuser: boolean };
  data: UserJson;
};

const post: TypedApiHandlerWithAuth<UsersPostSignature> = async (req, res) => {
  if (!req.auth.superuser) {
    throw new UserPermissionError();
  }
  const { email, superuser } = req.body;

  if (email == null || superuser == null) {
    throw new MissingArgsError(
      // @ts-ignore: filter out falsy
      [!email && "email", !superuser && "superuser"].filter(Boolean)
    );
  }

  const user = new User({
    email,
    superuser,
  });

  await user.save();

  return res.json(user);
};

export default initHandler({
  GET: get,
  POST: post,
});
