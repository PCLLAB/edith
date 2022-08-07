import { NextApiHandler } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import initHandler, {
  MissingArgsError,
  TypedApiHandler,
} from "../../../../lib/initHandler";
import config from "../../../../lib/config";
import User, { RawUnsafeUserDoc, UserJson } from "../../../../models/User";

export type PostReqBody = {
  email: string;
  password: string;
};

export type PostResBody = {
  message: string;
  token: string;
  user: UserJson;
};

const post: TypedApiHandler<{ body: PostReqBody }, PostResBody> = async (
  req,
  res
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MissingArgsError(
      // @ts-ignore: filter out falsy
      [!email && "email", !password && "password"].filter(Boolean)
    );
  }

  const UNSAFE_USER_WITH_PASSWORD: RawUnsafeUserDoc = await User.findOne({
    email,
  })
    .select("+password")
    .lean();

  const { password: passwordHash, ...user } = UNSAFE_USER_WITH_PASSWORD;

  const passwordMatch = await bcrypt.compare(password, passwordHash);

  if (!passwordMatch) {
    throw "Wrong Email or Password";
  }

  const token = jwt.sign(user, config.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.json({
    message: "Authentication successful",
    token,
    user,
  });
};

export default initHandler({
  POST: post,
});
