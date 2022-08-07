import { moveDirectory } from "../../../../../lib/apiUtils";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Directory, { DirectoryJson } from "../../../../../models/Directory";

export const ENDPOINT = "/api/v2/directories/[id]";

export type DirectoriesIdGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: DirectoryJson;
};

const get: TypedApiHandlerWithAuth<DirectoriesIdGetSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const dir = await Directory.findById(id).lean();

  res.json(dir);
};

type PutBody = {
  name: string;
  ownerIds: string[];
  prefixPath: string;
};

export type DirectoriesIdPutSignature = {
  url: typeof ENDPOINT;
  method: "PUT";
  query: {
    id: string;
  };
  body: {
    name?: string;
    ownerIds?: string[];
    prefixPath?: string;
  };
  data: DirectoryJson;
};

const put: TypedApiHandlerWithAuth<DirectoriesIdPutSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const dir = await Directory.findById(id);

  const { name, ownerIds, prefixPath } = req.body;

  if (ownerIds) {
    dir.ownerIds = ownerIds;
    await dir.save();
  }

  if (prefixPath || name) {
    await moveDirectory(dir, {
      name: name ?? dir.name,
      prefixPath: prefixPath ?? dir.prefixPath,
    });
  }

  res.json(dir);
};

export type DirectoriesIdDeleteSignature = {
  url: typeof ENDPOINT;
  method: "DELETE";
  query: {
    id: string;
  };
  data: {
    message: string;
  };
};

const del: TypedApiHandlerWithAuth<DirectoriesIdDeleteSignature> = async (
  req,
  res
) => {
  const id = req.query.id;
};

export default initHandler({
  GET: get,
  PUT: put,
  DELETE: del,
});
