import mongoose, { Types } from "mongoose";
import dbConnect from "../lib/server/dbConnect";
import { InvalidArgsError } from "../lib/server/initHandler";
import { throwIfNull } from "../lib/server/throwIfNull";
import Experiment from "./Experiment";

export interface DirectoryDoc<IdType = Types.ObjectId, DateType = Date> {
  _id: IdType;
  name: string;
  ownerIds: Types.Array<IdType>;
  /** Comma delimited string of ancestor ids ex: "r,ADS93,SD422" */
  prefixPath: string;
  /** Comma delimited string of ancestor names ex: "Root,Books,Programming" */
  namedPrefixPath: string;
  /** Managed by mongoose using timestamp option*/
  createdAt: DateType;
  /** Managed by mongoose using timestamp option*/
  updatedAt: DateType;
}

export interface DirectoryJson
  extends Omit<DirectoryDoc<string, string>, "ownerIds"> {
  ownerIds: string[];
}

export const ROOT_DIRECTORY = {
  _id: "r",
  name: "Root",
};

const arrayNotEmpty = (array: any[]) => array.length;

const DirectorySchema = new mongoose.Schema<DirectoryDoc>(
  {
    name: {
      type: String,
      required: [true, "Please provide a folder name"],
      trim: true,
    },
    ownerIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: [arrayNotEmpty, "Must have at least one owner"],
    },
    prefixPath: {
      type: String,
      default: "r",
      match: [/^r(,([a-z\d]){24})*$/, "Incorrect prefixpath pattern"],
    },
    namedPrefixPath: {
      type: String,
      default: "Root",
      match: [
        /^Root(,[A-Za-z\d\-_\s]+)*$/,
        "Incorrect namedPrefixPath pattern",
      ],
    },
  },
  { timestamps: true }
);

DirectorySchema.plugin(throwIfNull("Directory"));

const Directory =
  mongoose.models.Directory || mongoose.model("Directory", DirectorySchema);

export default Directory;

export const getIdFromPath = (path: string) => path.split(",").pop() as string;

type AnyDirectory = DirectoryDoc | DirectoryJson | typeof ROOT_DIRECTORY;

export const isRoot = (dir: AnyDirectory): dir is typeof ROOT_DIRECTORY =>
  isRootId(dir._id);

export const isRootId = (dirId: string | Types.ObjectId) =>
  dirId.toString() === ROOT_DIRECTORY._id;

export const getPath = (dir: AnyDirectory) => {
  return isRoot(dir) ? ROOT_DIRECTORY._id : `${dir.prefixPath},${dir._id}`;
};

export const getNamedPath = (dir: AnyDirectory) => {
  return isRoot(dir)
    ? ROOT_DIRECTORY.name
    : `${dir.namedPrefixPath},${dir.name}`;
};

export const moveDirectory = async (
  dir: any, // mongoose documents are any-typed for performance reasons?
  { name, prefixPath }: { name: string; prefixPath: string }
) => {
  const nameChanged = dir.name !== name;
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

  const oldNamedPath = `${dir.namedPrefixPath},${dir.name}`;
  const newNamedPath = `${getNamedPath(newParentDir)},${name}`;

  const db = await dbConnect();
  const session = await db.startSession();

  session.startTransaction();

  try {
    const dirs = await Directory.find({ prefixPath: oldPathRegex }).lean();
    const dirUpdates = dirs.map((dir) => {
      const pathUpdate = pathChanged
        ? { prefixPath: dir.prefixPath.replace(oldPath, newPath) }
        : {};
      const nameUpdate =
        pathChanged || nameChanged
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
  dir.namedPrefixPath = getNamedPath(newParentDir);
  await dir.save();
  session.commitTransaction();
  await session.endSession();
};
