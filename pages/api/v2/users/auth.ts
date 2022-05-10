import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import initHandler, {
  MissingArgsError, ModelNotFoundError,
} from "../../../../lib/initHandler";
import config from "../../../../lib/config";
import User, { RawUnsafeUserDoc } from "../../../../models/User";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MissingArgsError(
      [email && "email", password && "password"].filter(Boolean)
    );
  }

  const UNSAFE_USER_WITH_PASSWORD: RawUnsafeUserDoc = await User.findOne({
    email,
  })
    .select("+password")
    .lean();

  if (!UNSAFE_USER_WITH_PASSWORD) {
    throw new ModelNotFoundError("User")
  }

  const { password: passwordHash, ...user } = UNSAFE_USER_WITH_PASSWORD;

  const passwordMatch = await bcrypt.compare(password, passwordHash);

  if (!passwordMatch) {
    throw "Wrong Email or Password";
  }

  const token = jwt.sign(user, config.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.status(200).json({
    message: "Authentication successful",
    token,
    user,
  });
};

export default initHandler({
  POST: post,
});
