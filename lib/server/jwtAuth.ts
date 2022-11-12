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
  //  Deleted and privilege modified users should have token revoked
  getToken: (req) => req.cookies[JWT_COOKIE_KEY],
  isRevoked: async (_, token) => {
    const { _id, superuser } = token?.payload as JwtPayload;

    if (!_id) return true;

    //TODO this throws if user doesn't exist, is that right?
    try {
      const user = await User.findById(_id).lean();
      if (superuser !== user.superuser) return true;
    } catch (e) {
      return true;
    }

    return false;
  },
}).unless({
  // routes without authentication
  path: ["/api/v2/users/auth"],
});

export default initMiddleware(jwtMiddleware);
