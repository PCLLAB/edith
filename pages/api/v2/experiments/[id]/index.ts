import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  switch (req.method) {
    case "PUT":
    case "DELETE":
    default:
      throw ["PUT", "DELETE"];
  }
}
