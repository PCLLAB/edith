import initHandler, {
  NextApiHandlerWithAuth,
} from "../../../../../lib/initHandler";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const { depth = 1, experiments = true, directories = true } = req.query;
};

export default initHandler({
  GET: get,
});
