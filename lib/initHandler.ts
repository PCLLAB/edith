import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import dbConnect from "./dbConnect";
import jwtAuth from "./jwtAuth";
/**
 * Wrap all api handlers to run global middleware and error handlers
 * @param handler NextApiHandler
 */
const initHandler = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // need before jwtAuth, because we verify users
      await dbConnect();

      // run global middleware here
      await jwtAuth(req, res);

      await handler(req, res);
    } catch (err) {
      // run global error handler
      errorHandler(err, res);
    }
  };
};

type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE";

export class NotAllowedMethodError extends Error {
  methods: HTTP_METHOD[];

  // Method from NextApiRequest is optional string
  constructor(method: string | undefined, methods: HTTP_METHOD[]) {
    super(`Method ${method} Not Allowed`);
    this.name = "NotAllowedMethodError";
    this.methods = methods;
  }
}

const errorHandler = (err: any, res: NextApiResponse) => {
  // console.log(err)
  if (typeof err === "string") {
    // Handle bad requests which is everything we throw manually
    return res.status(400).json({ message: err });
  }

  const message = err.message;

  switch (err.name) {
    case "NotAllowedMethodError":
      res.setHeader("Allow", err.methods);
      return res.status(405).json({ message });
    case "UnauthorizedError":
      return res.status(401).json({ message });
    default:
      return res.status(500).json({ message });
  }

  // // This accepts arrays as the Allow field for 405 Method Not Allowed
  // if (Array.isArray(err)) {
  //   res.setHeader("Allow", err);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }

  // // 420 is unassigned and used here for application specific error
  // if (typeof err === "string") {
  //   return res.status(420).json({ message: err });
  // }

  // // express-jwt throws this when token is authorized
  // if (err.name === "UnauthorizedError") {
  //   return res.status(401).json({ message: err.message });
  // }
};

export default initHandler;
