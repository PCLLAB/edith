import { NextApiResponse } from "next";
import initHandler, {
  UserPermissionError,
  MissingArgsError,
  NextApiHandlerWithAuth,
} from "../../../../lib/initHandler";
import User from "../../../../models/User";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const users = await User.find().lean();
  return res.json(users);
};

const post: NextApiHandlerWithAuth = async (req, res) => {
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
