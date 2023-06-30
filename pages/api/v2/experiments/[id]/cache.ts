import { CachedDataEntryJson } from "../../../../../lib/common/types/models";
import { ModelNotFoundError } from "../../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../lib/server/initHandler";
import { CachedDataEntry } from "../../../../../models/DataEntry";

export const ENDPOINT = "/api/v2/experiments/[id]/cache";

export type GetExperimentsIdCache = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: CachedDataEntryJson[];
};

const GET: TypedApiHandlerWithAuth<GetExperimentsIdCache> = async (
  req,
  res
) => {
  const id = req.query.id;
  const data = await CachedDataEntry.find({ experiment: id });

  res.json(data);
};

export type DeleteExperimentsIdCache = {
  url: typeof ENDPOINT;
  method: "DELETE";
  query: {
    id: string;
  };
  data: {
    message: string;
    deleted: number;
  };
};

const DELETE: TypedApiHandlerWithAuth<DeleteExperimentsIdCache> = async (
  req,
  res
) => {
  const id = req.query.id;
  const deleteResult = await CachedDataEntry.deleteMany({ experiment: id });

  if (!deleteResult.deletedCount) {
    throw new ModelNotFoundError("CachedDataEntry");
  }

  res.json({
    message: `Deleted ${deleteResult.deletedCount}: ${id}`,
    deleted: deleteResult.deletedCount,
  });
};

export default initHandler({
  GET,
  DELETE,
});
