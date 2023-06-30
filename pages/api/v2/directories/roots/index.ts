import type { DirectoryJson } from "../../../../../lib/common/types/models";
import initHandler, { ApiHandler } from "../../../../../lib/server/initHandler";
import Directory from "../../../../../models/Directory";

export const ENDPOINT = "/api/v2/directories/roots";

export type GetDirectoriesRoots = {
  url: typeof ENDPOINT;
  method: "GET";
  data: DirectoryJson[];
};

const GET: ApiHandler<GetDirectoriesRoots> = async (req, res) => {
  const dirs = await Directory.find({ prefixPath: "" }).lean();
  res.json(dirs);
};

export default initHandler({
  GET,
});
