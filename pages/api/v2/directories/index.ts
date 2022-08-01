import { getIdFromPath } from "../../../../lib/apiUtils";
import initHandler, {
  MissingArgsError,
  TypedApiHandlerWithAuth,
} from "../../../../lib/initHandler";
import Directory from "../../../../models/Directory";

/**
 * Get All Directories
 *
 * GET - /api/v2/directories (Get array of directories)
 */
export const ENDPOINT = "/api/v2/directories";

const get: TypedApiHandlerWithAuth = async (req, res) => {
  const dirs = await Directory.find().lean();
  res.json(dirs);
};

const post: TypedApiHandlerWithAuth = async (req, res) => {
  const { name, prefixPath } = req.body;
  const user = req.auth._id;

  if (!name) {
    throw new MissingArgsError(["name"]);
  }

  if (!prefixPath) {
    const dir = new Directory({
      name,
      ownerIds: [user],
    });
    await dir.save();
    return res.json(dir);
  }

  const parentId = getIdFromPath(prefixPath);
  const parentDir = await Directory.findById(parentId).lean();

  const namedPrefixPath = `${parentDir.namedPrefixPath},${parentDir.name}`;

  const dir = new Directory({
    name,
    prefixPath,
    namedPrefixPath,
    ownerIds: [user],
  });

  await dir.save();

  res.json(dir);
};

export default initHandler({
  GET: get,
  POST: post,
});
