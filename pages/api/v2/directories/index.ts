import initHandler, {
  MissingArgsError,
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Directory, {
  DirectoryJson,
  getIdFromPath,
} from "../../../../models/Directory";

export const ENDPOINT = "/api/v2/directories";

export type DirectoriesGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  data: DirectoryJson[];
};

const get: TypedApiHandlerWithAuth<DirectoriesGetSignature> = async (
  req,
  res
) => {
  const dirs = await Directory.find().lean();
  res.json(dirs);
};

export type DirectoriesPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  body: {
    name: string;
    prefixPath?: string;
  };
  data: DirectoryJson;
};

const post: TypedApiHandlerWithAuth<DirectoriesPostSignature> = async (
  req,
  res
) => {
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
