import { moveDirectory } from "../../../../../lib/apiUtils";
import initHandler, {
  ModelNotFoundError,
  NextApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Directory from "../../../../../models/Directory";

const get: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const dir = await Directory.findById(id).lean();

  if (!dir) {
    throw new ModelNotFoundError("Directory");
  }

  res.json(dir);
};

const put: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;

  const dir = await Directory.findById(id);

  if (!dir) {
    throw new ModelNotFoundError("Directory");
  }

  const { name, ownerIds, prefixPath } = req.body;

  if (ownerIds) {
    dir.ownerIds = ownerIds;
    await dir.save();
  }

  if (prefixPath || name) {
    await moveDirectory(dir, { name, prefixPath });
  }

  res.json(dir);
};

const del: NextApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
};

export default initHandler({
  GET: get,
  PUT: put,
  DELETE: del,
});
