import create from "zustand";

import { DirectoryJson } from "../../../common/models/types";
import { getPath } from "../../../common/models/utils";

interface DirectoryState {
  directories: Record<string, DirectoryJson>;
  updateDirectory: (id: string, update: DirectoryJson) => void;
  deleteDirectory: (id: string) => void;
}

export const useDirectoryStore = create<DirectoryState>((set) => ({
  directories: {},
  updateDirectory: (id, update) =>
    set((state) => {
      // If create or simple update
      if (
        !(id in state.directories) ||
        update.prefixPath === state.directories[id].prefixPath
      ) {
        return { directories: { ...state.directories, [id]: update } };
      }

      const oldSubtreePrefix = getPath(state.directories[id]);
      const newSubtreePrefix = getPath(update);
      const updatedTree = Object.fromEntries(
        Object.entries(state.directories).map(([id, dir]) => {
          if (!dir.prefixPath.startsWith(oldSubtreePrefix)) {
            return [id, dir];
          }
          const prefixPath = dir.prefixPath.replace(
            oldSubtreePrefix,
            newSubtreePrefix
          );

          return [
            id,
            {
              ...dir,
              prefixPath,
            },
          ];
        })
      );

      return {
        directories: { ...updatedTree, [id]: update },
      };
    }),
  deleteDirectory: (id) =>
    set((state) => {
      const subtreePrefix = getPath(state.directories[id]);

      const { [id]: _, ...others } = state.directories;

      const keep = Object.fromEntries(
        Object.entries(others).filter(
          ([_id, dir]) => !dir.prefixPath.startsWith(subtreePrefix)
        )
      );
      return { directories: keep };
    }),
}));
