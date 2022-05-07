import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import initHandler, {
  NotAllowedMethodError,
} from "../../../../lib/initHandler";
import Experiment from "../../../../models/Experiment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  switch (req.method) {
    case "GET":
      return getExperiments(req, res);
    case "POST":
      break;
    default:
      throw new NotAllowedMethodError(req.method, ["GET", "PUT"]);
  }
};
export default initHandler(handler);

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
