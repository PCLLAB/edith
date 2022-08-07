import { getPath } from "../../../../../lib/apiUtils";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Directory, { DirectoryJson } from "../../../../../models/Directory";
import Experiment, { ExperimentJson } from "../../../../../models/Experiment";

export const ENDPOINT = "/api/v2/directories/[id]/children";

export type DirectoriesIdChildrenGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
    depth?: number;
    experiments?: "";
    directories?: "";
  };
  data: {
    experiments?: ExperimentJson[];
    directories?: DirectoryJson[];
  };
};

const get: TypedApiHandlerWithAuth<DirectoriesIdChildrenGetSignature> = async (
  req,
  res
) => {
  const { id, depth, experiments, directories } = req.query;

  const parent = await Directory.findById(id);
  const path = getPath(parent);

  const data: {
    experiments?: ExperimentJson[];
    directories?: DirectoryJson[];
  } = {};

  if (experiments != null) {
    data.experiments = await Experiment.find({
      prefixPath: new RegExp(`^${path}`),
    }).lean();
  }

  if (directories != null) {
    data.directories = await Directory.find({
      prefixPath: new RegExp(`^${path}`),
    }).lean();
  }

  res.status(200).send(data);
};

export default initHandler({
  GET: get,
});
