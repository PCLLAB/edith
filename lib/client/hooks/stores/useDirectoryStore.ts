import create from "zustand";

import { DirectoryJson } from "../../../common/models/types";
import { getPath } from "../../../common/models/utils";

interface DirectoryState {
  directories: Record<string, DirectoryJson>;
  updateDirectories: (updates: DirectoryJson[]) => void;
  deleteDirectories: (ids: string[]) => void;
}

// Look, it's not beautiful, but it works and it's easy to understand
// I did try to write it more "functionally", but it got too complicated

export const useDirectoryStore = create<DirectoryState>((set) => ({
  directories: {},
  updateDirectories: (updates) =>
    set((state) => {
      const currentDirList = Object.values(state.directories);
      const mutableDirMap = { ...state.directories };

      updates.forEach((update) => {
        mutableDirMap[update._id] = update;

        const existingEntry = state.directories[update._id];
        if (!existingEntry || update.prefixPath === existingEntry.prefixPath) {
          return;
        }

        const oldSubtreePrefix = getPath(existingEntry);
        const newSubtreePrefix = getPath(update);
        currentDirList.forEach((dir) => {
          if (!dir.prefixPath.startsWith(oldSubtreePrefix)) {
            return;
          }
          mutableDirMap[update._id].prefixPath = dir.prefixPath.replace(
            oldSubtreePrefix,
            newSubtreePrefix
          );
        });
      });
      return { directories: mutableDirMap };
    }),
  deleteDirectories: (ids) =>
    set((state) => {
      const currentDirList = Object.values(state.directories);
      const mutableDirMap = state.directories;
      ids.forEach((id) => {
        delete mutableDirMap[id];

        const subtreePrefix = getPath(state.directories[id]);

        currentDirList.forEach((dir) => {
          if (!dir.prefixPath.startsWith(subtreePrefix)) {
            return;
          }
          delete mutableDirMap[dir._id];
        });
      });
      return { directories: mutableDirMap };
    }),
}));
