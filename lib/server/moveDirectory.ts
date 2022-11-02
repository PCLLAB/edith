import Directory from "../../models/Directory";
import Experiment from "../../models/Experiment";
import { ROOT_DIRECTORY } from "../common/models/utils";
import { getIdFromPath, getPath, isRootId } from "../common/models/utils";
import dbConnect from "./dbConnect";
import { InvalidArgsError } from "./errors";

export const moveDirectory = async (
  dir: any, // mongoose documents are any-typed for performance reasons?
  { name, prefixPath }: { name: string; prefixPath: string }
) => {
  // const nameChanged = dir.name !== name;
  const pathChanged = dir.prefixPath !== prefixPath;

  const newParentId = getIdFromPath(prefixPath);
  const newParentDir = isRootId(newParentId)
    ? ROOT_DIRECTORY
    : await Directory.findById(newParentId).lean();

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

    if (pathChanged) {
      const exps = await Experiment.find({ prefixPath: oldPathRegex });
      const expUpdates = exps.map((exp) => {
        return {
          updateOne: {
            filter: { _id: exp._id },
            update: { prefixPath: exp.prefixPath.replace(oldPath, newPath) },
          },
        };
      });
      await Experiment.bulkWrite(expUpdates);
    }
  } catch (err) {
    session.abortTransaction();
    await session.endSession();
    return;
  }

  dir.name = name;
  dir.prefixPath = prefixPath;
  await dir.save();
  session.commitTransaction();
  await session.endSession();
};
