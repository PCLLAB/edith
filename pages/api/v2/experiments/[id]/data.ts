import initHandler, {
  NextApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Experiment, { Archive } from "../../../../../models/Experiment";

// const get: NextApiHandlerWithAuth = async (req, res) => {
//   const { id, limit, skip, ...others } = req.query;


// };

const post: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  // TODO this is hard
};

export default initHandler({
  // GET: get,
  POST: post,
});
