import {
  DirectoryJson,
  ExperimentJson,
} from "../../../../../lib/common/types/models";
import { getPath } from "../../../../../lib/common/utils";
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
  const { id } = req.query;

  const parent = await Directory.findById(id);
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
