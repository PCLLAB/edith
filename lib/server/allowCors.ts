import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHOD } from "./initHandler";

type Params = {
  allowedMethods?: HTTP_METHOD[];
  allowedHeaders?: string[];
};

export const makePreflightHandler = ({
  allowedMethods = ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  // we only use Content-Type, but should consider using some others? like CSRF token
  allowedHeaders = [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
  ],
}: Params) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(","));
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(","));

    res.status(200).end();
  };
};
