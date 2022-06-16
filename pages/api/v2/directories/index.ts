import initHandler, {
  MissingArgsError,
  ModelNotFoundError,
  NextApiHandlerWithAuth,
} from "../../../../lib/initHandler";
import Directory from "../../../../models/Directory";

/**
 * Get All Directories
 *
 * GET - /api/v2/directories (Get array of directories)
 */
const get: NextApiHandlerWithAuth = async (req, res) => {
  const dirs = await Directory.find().lean();
  res.json(dirs);
};

const post: NextApiHandlerWithAuth = async (req, res) => {
  const { name, parent } = req.body;
  const user = req.auth._id;

  if (!name) {
    throw new MissingArgsError(["name"]);
  }

  if (!parent) {
    const dir = new Directory({
      name,
      ownerIds: [user],
    });
    await dir.save();
    return res.json(dir);
  }

  const parentDir = await Directory.findById(parent).lean();

  if (!parentDir) {
    throw new ModelNotFoundError("Directory");
  }

  const prefixPath = `${parentDir.prefixPath},${parentDir._id}`;
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
