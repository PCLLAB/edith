import { DateTime } from "luxon";
import type {
  AnyDirectory,
  DirectoryFile,
  DirectoryJson,
  ExperimentJson,
} from "./types/models";

export const getAncestorsMinusRoot = (dir: AnyDirectory) =>
  dir.prefixPath.split(",").slice(1);

export const getIdFromPath = (path: string) => path.split(",").pop() as string;

export const getPath = (dir: AnyDirectory) =>
  `${dir.prefixPath}${dir.prefixPath ? "," : ""}${dir._id}`;

export const isDirectory = (file: DirectoryFile): file is DirectoryJson => {
  return !isExperiment(file);
};

export const isExperiment = (file: DirectoryFile): file is ExperimentJson => {
  return "directory" in file;
};

export const getLocalDayISO = (date: Date, timezone: string) => {
  return DateTime.fromJSDate(date).setZone(timezone).endOf("day").toISO();
};
