import Directory, {
  DirectoryDoc,
  DirectoryJson,
  ROOT_DIRECTORY,
} from "../models/Directory";
import Experiment from "../models/Experiment";
import dbConnect from "./dbConnect";
import { InvalidArgsError } from "./initHandler";

export const getIdFromPath = (path: string) => path.split(",").pop();

type AnyDirectory = DirectoryDoc | DirectoryJson | typeof ROOT_DIRECTORY;

export const isRoot = (dir: AnyDirectory): dir is typeof ROOT_DIRECTORY =>
  dir._id.toString() === ROOT_DIRECTORY._id;

export const getPath = (dir: AnyDirectory) => {
  return isRoot(dir) ? ROOT_DIRECTORY._id : `${dir.prefixPath},${dir._id}`;
};

export const getNamedPath = (dir: AnyDirectory) => {
  return isRoot(dir)
    ? ROOT_DIRECTORY.name
    : `${dir.namedPrefixPath},${dir._id}`;
};

export const moveDirectory = async (
  dir: any, // mongoose documents are any-typed for performance reasons?
  { name, prefixPath }: { name: string; prefixPath: string }
) => {
  const newParentId = getIdFromPath(prefixPath);
  const newParentDir =
    newParentId === ROOT_DIRECTORY._id
      ? ROOT_DIRECTORY
      : await Directory.findById(newParentId).lean();
  if (!newParentDir || getPath(newParentDir) !== prefixPath) {
    throw new InvalidArgsError(["prefixPath"]);
  }

  const oldPath = `${dir.prefixPath},${dir._id}`;
  const oldPathRegex = new RegExp(`^${oldPath}`);
  const newPath = `${prefixPath},${dir._id}`;

  const oldNamedPath = `${dir.namedPrefixPath},${dir.name}`;
  const newNamedPath = `${getNamedPath(newParentDir)},${name}`;

  const db = await dbConnect();
  const session = await db.startSession();

  session.startTransaction();

  try {
    const dirs = await Directory.find({ prefixPath: oldPathRegex }).lean();
    console.log("need to change dirs", dirs.length);
    const dirUpdates = dirs.map((dir) => {
      const pathUpdate = prefixPath
        ? { prefixPath: dir.prefixPath.replace(oldPath, newPath) }
        : {};
      const nameUpdate = name
        ? {
            namedPrefixPath: dir.namedPrefixPath.replace(
              oldNamedPath,
              newNamedPath
            ),
          }
        : {};
      return {
        updateOne: {
          filter: { _id: dir._id },
          update: { ...pathUpdate, ...nameUpdate },
        },
      };
    });
    await Directory.bulkWrite(dirUpdates);

    if (!prefixPath) {
      return;
    }
    const exps = await Experiment.find({ prefixPath: oldPathRegex });
    console.log("need to change exps", exps.length);
    const expUpdates = exps.map((exp) => {
      return {
        updateOne: {
          filter: { _id: exp._id },
          update: { prefixPath: exp.prefixPath.replace(oldPath, newPath) },
        },
      };
    });
    await Experiment.bulkWrite(expUpdates);
  } catch (err) {
    session.abortTransaction();
    await session.endSession();
    return;
  }

  dir.name = name;
  dir.prefixPath = prefixPath;
  dir.namedPrefixPath = getNamedPath(newParentDir);
  await dir.save();

  session.commitTransaction();
  await session.endSession();
};
