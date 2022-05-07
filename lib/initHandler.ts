import { NextApiRequest, NextApiResponse } from "next";
import { UserObj } from "../models/User";
import dbConnect from "./dbConnect";
import jwtAuth from "./jwtAuth";

type NextApiHandlerWithAuth = (
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) => void | Promise<void>;

/** Includes `auth` field as decoded jwt payload */
export interface NextApiRequestWithAuth extends NextApiRequest {
  auth: UserObj;
}

/**
 * Wrap all api handlers to run global middleware and error handlers
 * @param handler NextApiHandler
 */
const initHandler = (handler: NextApiHandlerWithAuth) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // need before jwtAuth, because we verify users
      await dbConnect();

      // run global middleware here
      await jwtAuth(req, res);

      // @ts-ignore: `auth` field is added by jwtAuth
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
    super(`${method} method not allowed`);
    this.name = "NotAllowedMethodError";
    this.methods = methods;
  }
}

export class MissingArgsError extends Error {
  constructor(args: string[]) {
    super(`Missing args: ${args}`);
    this.name = "MissingArgsError"
  }
}

export class UserPermissionError extends Error {
  constructor() {
    super("Must be owner of resource or superuser");
    this.name = "UserPermissionError";
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
    // express-jwt does not find a valid token
    case "UnauthorizedError":
      return res.status(401).json({ message });

    case "MissingArgsError":
      return res.status(400).json({ message });
    case "UserPermissionError":
      return res.status(403).json({ message });
    default:
      return res.status(500).json({ message });
  }
};

export default initHandler;
