import { NextApiResponse } from "next";
import initHandler, {
  UserPermissionError,
  MissingArgsError,
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import User, { UserJson } from "../../../../models/User";

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
  body: { email: string; password: string; name: string; superuser: boolean };
  data: UserJson;
};

const post: TypedApiHandlerWithAuth<UsersPostSignature> = async (req, res) => {
  if (!req.auth.superuser) {
    throw new UserPermissionError();
  }
  const { email, password, name, superuser } = req.body;

  if (!email || !password || !name) {
    throw new MissingArgsError(
      // @ts-ignore: filter out falsy
      [!email && "email", !password && "password", !name && "name"].filter(
        Boolean
      )
    );
  }

  const NEW_RAW_USER_WITH_PASSWORD = new User({
    email,
    password,
    name,
    superuser: !!superuser,
  });

  await NEW_RAW_USER_WITH_PASSWORD.save();

  const { password: _, ...user } = NEW_RAW_USER_WITH_PASSWORD.toObject();

  return res.json(user);
};

export default initHandler({
  GET: get,
  POST: post,
});
