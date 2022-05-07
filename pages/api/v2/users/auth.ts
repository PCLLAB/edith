import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import initHandler, {
  MissingArgsError,
  NotAllowedMethodError,
} from "../../../../lib/initHandler";
import config from "../../../../lib/config";
import User, { RawUnsafeUserDoc } from "../../../../models/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const { email, password } = req.body;

      if (!email || !password) {
        throw new MissingArgsError(
          [email && "email", password && "password"].filter(Boolean)
        );
      }

      const UNSAFE_USER_WITH_PASSWORD: RawUnsafeUserDoc = await User.findOne({
        email,
      }).select("+password");

      if (!UNSAFE_USER_WITH_PASSWORD) {
        throw "User Not Found";
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

      break;
    default:
      throw new NotAllowedMethodError(req.method, ["POST"]);
  }
};
export default initHandler(handler);
