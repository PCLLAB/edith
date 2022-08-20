import {
  DirectoryJson,
  ExperimentJson,
} from "../../../../../lib/common/models/types";
import {
  getPath,
  isRootId,
  ROOT_DIRECTORY,
} from "../../../../../lib/common/models/utils";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../lib/server/initHandler";
import Directory from "../../../../../models/Directory";
import Experiment from "../../../../../models/Experiment";

export const ENDPOINT = "/api/v2/directories/[id]/children";

export type DirectoriesIdChildrenGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
    depth?: number;
  };
  data: {
    experiments: ExperimentJson[];
    directories: DirectoryJson[];
  };
};

const get: TypedApiHandlerWithAuth<DirectoriesIdChildrenGetSignature> = async (
  req,
  res
) => {
  const { id, depth } = req.query;

  const parent = isRootId(id) ? ROOT_DIRECTORY : await Directory.findById(id);
  const path = getPath(parent);

  const data = {
    experiments: await Experiment.find({
      prefixPath: new RegExp(`^${path}`),
    }).lean(),
    directories: await Directory.find({
      prefixPath: new RegExp(`^${path}`),
    }).lean(),
  };

  res.status(200).send(data);
};

export default initHandler({
  GET: get,
});
