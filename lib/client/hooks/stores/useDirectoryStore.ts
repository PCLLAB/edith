import create from "zustand";
import { DirectoryJson, ExperimentJson } from "../../../common/models/types";

interface DirectoryState {
  directories: Record<string, DirectoryJson>;
  updateDirectory: (id: string, dir: DirectoryJson) => void;
  updateDirectoryContents: (
    id: string,
    contents: { directories: DirectoryJson[]; experiments: ExperimentJson[] }
  ) => void;
}

export const useDirectoryStore = create<DirectoryState>((set) => ({
  directories: {},
  updateDirectory: (id, dir) =>
    set((state) => ({ directories: { ...state.directories, [id]: dir } })),
  updateDirectoryContents: (id, contents) =>
    // TODO: figure out how to do this
    set((state) => {
      return { directories: state.directories };
    }),
}));
