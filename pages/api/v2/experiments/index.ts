import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import Experiment, { IExperiment } from "../../../../models/Experiment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getExperiments(req, res);
    case "POST":
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Get All Experiments
 *
 * GET - /api/v2/experiments (Get array of experiments)
 */
const getExperiments: NextApiHandler = async (req, res) => {
  try {
    const experiments = await Experiment.find();
    res.json(experiments);
  } catch (err) {
    res.status(500).end();
  }
};

const postExperiments: NextApiHandler = async (req, res) => {};
