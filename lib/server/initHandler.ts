import { NextApiRequest, NextApiResponse } from "next";

import { UserJson } from "../../models/User";
import { ApiSignature, HTTP_METHOD } from "../common/types";
import dbConnect from "./dbConnect";
import { NotAllowedMethodError } from "./errors";
import jwtAuth from "./jwtAuth";

export type TypedApiHandlerWithAuth<T extends ApiSignature> = (
  /** Includes `auth` field as decoded jwt payload */
  req: Omit<NextApiRequest, "body"> &
    Pick<T, ("query" | "body") & keyof T> & { auth: UserJson },
  res: NextApiResponse<FieldsWithAny<T["data"]>>
) => void | Promise<void>;

export type TypedApiHandler<T extends ApiSignature> = (
  req: Omit<NextApiRequest, "body"> & Pick<T, ("query" | "body") & keyof T>,
  res: NextApiResponse<FieldsWithAny<T["data"]>>
) => void | Promise<void>;

/**
 * We want to type the response data shape for API calls.
 * We can't check the field types passed into res.json(),
 * because it will change after getting stringified + parsed
 *
 * eg. ObjectId -> after stringified + parsed -> string
 */
type FieldsWithAny<T> = {
  [Property in keyof T]: any;
};

/** Query fields are converted to string or string[] when parsing */
export type StringifyFields<T> = {
  [Property in keyof T]: T[Property] extends any[] ? string[] : string;
};

export type MatchAction = Partial<
  Record<HTTP_METHOD, TypedApiHandlerWithAuth<any> | TypedApiHandler<any>>
>;

/**
 * Wrap all api handlers to run global middleware and error handlers
 * @param handler NextApiHandler
 */
const initHandler = (matcher: MatchAction) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // need before jwtAuth, because we verify users
      await dbConnect();

      // run global middleware here
      await jwtAuth(req, res);

      if (req.method && matcher.hasOwnProperty(req.method)) {
        // @ts-ignore: `req.auth` is added by jwtAuth
        return await matcher[req.method as HTTP_METHOD](req, res);
      }

      throw new NotAllowedMethodError(
        req.method,
        Object.keys(matcher) as HTTP_METHOD[]
      );
    } catch (err) {
      // run global error handler
      errorHandler(err, res);
    }
  };
};

const errorHandler = (err: any, res: NextApiResponse) => {
  // console.log(err)
  if (typeof err === "string") {
    // Handle one off errors
    return res.status(400).json({ message: err });
  }

  const message = err.message;

  switch (err.name) {
    case "NotAllowedMethodError":
      res.setHeader("Allow", err.methods);
      return res.status(405).json({ message });
    case "UnauthorizedError": // express-jwt does not find a valid token
      return res.status(401).json({ message });
    case "MissingArgsError":
      return res.status(400).json({ message });
    case "InvalidArgsError":
      return res.status(400).json({ message });
    case "ValidationError": // mongoose update/save validation error
      return res.status(400).json({ message });
    case "CastError": // mongoose, usually for invalid objectids
      return res.status(400).json({ message });
    case "UserPermissionError":
      return res.status(403).json({ message });
    case "ModelNotFoundError":
      return res.status(404).json({ message });
    default:
      return res.status(500).json({ message });
  }
};

export default initHandler;
