import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import apiWrapper from "../../../../lib/apiWrapper";
import dbConnect from "../../../../lib/dbConnect";
import Experiment, { IExperiment } from "../../../../models/Experiment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getExperiments(req, res);
    case "POST":
      break;
    default:
      throw ["GET", "PUT"];
  }
};
export default apiWrapper(handler);

/**
 * Get All Experiments
 *
 * GET - /api/v2/experiments (Get array of experiments)
 */
const getExperiments: NextApiHandler = async (req, res) => {
  const experiments = await Experiment.find();
  res.json(experiments);
};

const postExperiments: NextApiHandler = async (req, res) => {};
