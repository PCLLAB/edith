import Directory from "../../models/Directory";
import { getIdFromPath, getPath } from "../common/utils";
import dbConnect from "./dbConnect";
import { InvalidArgsError } from "./errors";

export const moveDirectory = async (
  dir: any, // mongoose documents are any-typed for performance reasons?
  prefixPath: string
) => {
  const newParentId = getIdFromPath(prefixPath);
  const newParentDir = await Directory.findById(newParentId).lean();

  if (getPath(newParentDir) !== prefixPath) {
    throw new InvalidArgsError(["prefixPath"]);
  }

  const oldPath = `${dir.prefixPath},${dir._id}`;
  const oldPathRegex = new RegExp(`^${oldPath}`);
  const newPath = `${prefixPath},${dir._id}`;

  const db = await dbConnect();
  const session = await db.startSession();

  session.startTransaction();

  try {
    const dirs = await Directory.find({ prefixPath: oldPathRegex }).lean();
    const dirUpdates = dirs.map((dir) => {
      return {
        updateOne: {
          filter: { _id: dir._id },
          update: { prefixPath: dir.prefixPath.replace(oldPath, newPath) },
        },
      };
    });
    await Directory.bulkWrite(dirUpdates);
  } catch (err) {
    session.abortTransaction();
    await session.endSession();
    return;
  }

  dir.prefixPath = prefixPath;

  await dir.save();

  session.commitTransaction();
  await session.endSession();
};
