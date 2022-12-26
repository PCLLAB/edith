import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_COOKIE_KEY } from "../../../../lib/common/constants";
import {
  RawUnsafeUserDoc,
  UserJson,
} from "../../../../lib/common/types/models";

import config from "../../../../lib/config";
import { MissingArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandler,
} from "../../../../lib/server/initHandler";
import User from "../../../../models/User";

export const ENDPOINT = "/api/v2/users/auth";

export type UsersAuthPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  body: {
    email: string;
    password: string;
  };
  data: {
    message: string;
    user: UserJson;
  };
};

const post: TypedApiHandler<UsersAuthPostSignature> = async (req, res) => {
  req.query;
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

  res.setHeader(
    "Set-Cookie",
    `${JWT_COOKIE_KEY}=${token}; Secure; HttpOnly; SameSite=Lax; Path=/api/v2`
  );

  res.json({
    message: "Authentication successful",
    user,
  });
};

export default initHandler({
  POST: post,
});
