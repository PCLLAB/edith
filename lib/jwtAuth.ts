import { expressjwt } from "express-jwt";
import User from "../models/User";
import config from "./config";
import initMiddleware from "./initMiddleware";

const jwtMiddleware = expressjwt({
  secret: config.JWT_SECRET,
  //  HS256 is symmetric (one secret), RS256 asymmetric (public private)
  //  We handle auth ourselves, so no point in being asymmetric
  algorithms: ["HS256"],
  //  Deleted users should have token revoked
  isRevoked: async (_, token) => {
    const userId = token?.payload._id;
    if (!userId) return false;
    return !!(await User.exists({ _id: userId }));
  },
}).unless({
  // routes without authentication
  path: ["/api/v2/users/auth"],
});

export default initMiddleware(jwtMiddleware);
