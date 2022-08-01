import initHandler, {
  ModelNotFoundError,
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import { CachedDataEntry } from "../../../../../models/DataEntry";

const get: TypedApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
  const data = await CachedDataEntry.find({ experiment: id });

  res.json(data);
};

const del: TypedApiHandlerWithAuth = async (req, res) => {
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
  GET: get,
  DELETE: del,
});
