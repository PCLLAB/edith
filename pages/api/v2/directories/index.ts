import type { DirectoryJson } from "../../../../lib/common/types/models";
import { MissingArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Directory from "../../../../models/Directory";

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
    prefixPath: string;
  };
  data: DirectoryJson;
};

const post: TypedApiHandlerWithAuth<DirectoriesPostSignature> = async (
  req,
  res
) => {
  const { name, prefixPath } = req.body;
  const user = req.auth._id;

  if (!name || prefixPath == null) {
    throw new MissingArgsError(
      // @ts-ignore: filter out falsy
      [!name && "name", prefixPath == null && "prefixPath"].filter(Boolean)
    );
  }

  const dir = new Directory({
    name,
    prefixPath,
    ownerIds: [user],
  });

  await dir.save();

  res.json(dir);
};

export default initHandler({
  GET: get,
  POST: post,
});
