import initHandler, {
  NextApiHandlerWithAuth,
} from "../../../../../lib/initHandler";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
};

const put: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
};

const del: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
};


export default initHandler({
  GET: get,
  PUT: put,
  DELETE: del,
});
