import { expressjwt } from "express-jwt";
import config from "./config";
import initMiddleware from "./initMiddleware";

const jwtMiddleware = expressjwt({
  secret: config.PASSPORT_JWT_SECRET,
  algorithms: ["RS256"], // asymmetic, hs256 is symmetric, not sure which is better
}).unless({
  path: [], // /api/v2/whatever is unauthenticated
});

export default initMiddleware(jwtMiddleware);
