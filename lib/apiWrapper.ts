import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwtMiddleware from "./jwtMiddleware";
/**
 * Wrap all api handlers to run global middleware and error handlers
 * @param handler NextApiHandler
 */
const apiWrapper = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // run global middleware here
      await jwtMiddleware(req, res);

      await handler(req, res);
    } catch (err) {
      // run global error handler
      errorHandler(err, req, res);
    }
  };
};
/**
 * Babel does not support extending built-in types like Error without hacks
 * 
 * I somewhat abuse the type of `err` to differentiate errors
 */
const errorHandler = (err: any, req: NextApiRequest, res: NextApiResponse) => {
  // This accepts arrays as the Allow field for 405 Method Not Allowed
  if (Array.isArray(err)) {
    res.setHeader("Allow", err);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 420 is unassigned and used here for application specific error
  if (typeof err === "string") {
    return res.status(420).json({ message: err });
  }

  // express-jwt throws this when token is authorized
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: err.message });
  }

  res.status(500).json({ message: err.message });
};

export default apiWrapper;
