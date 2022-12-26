import { StateCreator } from "zustand";

import { DirectoryJson } from "../../../common/types/models";
import { getPath } from "../../../common/utils";

export type DirectorySlice = {
  directory: Record<string, DirectoryJson>;
  updateDirectories: (updates: DirectoryJson[]) => void;
  deleteDirectories: (ids: string[]) => void;
};

// Look, it's not beautiful, but it works and it's easy to understand
// I did try to write it more "functionally", but it got too complicated

export const createDirectorySlice: StateCreator<DirectorySlice> = (set) => ({
  directory: {},
  updateDirectories: (updates) =>
    set((state) => {
      const currentDirList = Object.values(state.directory);
      const mutableDirMap = { ...state.directory };

      updates.forEach((update) => {
        mutableDirMap[update._id] = update;

        const existingEntry = state.directory[update._id];
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
      return { directory: mutableDirMap };
    }),
  deleteDirectories: (ids) =>
    set((state) => {
      const currentDirList = Object.values(state.directory);
      const mutableDirMap = state.directory;
      ids.forEach((id) => {
        delete mutableDirMap[id];

        const subtreePrefix = getPath(state.directory[id]);

        currentDirList.forEach((dir) => {
          if (!dir.prefixPath.startsWith(subtreePrefix)) {
            return;
          }
          delete mutableDirMap[dir._id];
        });
      });
      return { directory: mutableDirMap };
    }),
});
