import type { AnyDirectory, RootDirectory } from "./types";

import type { Types } from "mongoose";

export const ROOT_DIRECTORY: RootDirectory = {
  _id: "r",
  name: "Root",
};

export const getIdFromPath = (path: string) => path.split(",").pop() as string;

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
