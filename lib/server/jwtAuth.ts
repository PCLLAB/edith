import { expressjwt } from "express-jwt";
import { JwtPayload } from "jsonwebtoken";

import User from "../../models/User";
import { JWT_COOKIE_KEY } from "../common/constants";
import config from "../config";
import initMiddleware from "./initMiddleware";

const jwtMiddleware = expressjwt({
  secret: config.JWT_SECRET,
  //  HS256 is symmetric (one secret), RS256 asymmetric (public private)
  //  We handle auth ourselves, so no point in being asymmetric
  algorithms: ["HS256"],
  getToken: (req) => req.cookies[JWT_COOKIE_KEY],
  //  Deleted and privilege modified users should have token revoked
  isRevoked: async (_, token) => {
    const { _id, superuser, email, name } = token?.payload as JwtPayload;

    if (!_id) return true;

    //TODO this throws if user doesn't exist, is that right?
    try {
      const user = await User.findById(_id).lean();

      // Revoke on any modification
      if (superuser !== user.superuser) return true;
      if (email !== user.email) return true;
      if (name !== user.name) return true;
    } catch (e) {
      return true;
    }

    return false;
  },
}).unless({
  // routes without authentication
  path: [
    { url: "/api/v2/users/auth", method: "POST" },
    { url: /\/api\/v2\/users\/[a-f0-9]{24}\/setup/, method: "POST" },
    { url: /\/api\/v2\/experiments\/[a-f0-9]{24}\/data/, method: "POST" },
  ],
});

export default initMiddleware(jwtMiddleware);
