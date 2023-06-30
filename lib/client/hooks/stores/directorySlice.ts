import { StateCreator } from "zustand";
import { PostDirectories } from "../../../../pages/api/v2/directories";
import { GetDirectoriesRoots } from "../../../../pages/api/v2/directories/roots";
import {
  DeleteDirectoriesId,
  GetDirectoriesId,
  PutDirectoriesId,
} from "../../../../pages/api/v2/directories/[id]";
import { GetDirectoriesIdChildren } from "../../../../pages/api/v2/directories/[id]/children";

import { DirectoryJson } from "../../../common/types/models";
import { getPath } from "../../../common/utils";
import { fetcher } from "../../fetcher";
import { ExperimentSlice } from "./experimentSlice";

export type DirectorySlice = {
  directoryMap: Record<string, DirectoryJson>;
  deleteDirectory: (id: string) => Promise<void>;
  getDirectory: (id: string) => Promise<void>;
  getDirectoryRoots: () => Promise<DirectoryJson[]>;
  getDirectoryContent: (id: string) => Promise<void>;
  createDirectory: (body: PostDirectories["body"]) => Promise<void>;
  updateDirectory: (
    id: string,
    update: PutDirectoriesId["body"]
  ) => Promise<void>;
};

/**
 * Anytime an existing directory is moved, all its descendent directories
 * also need to update their `prefixPath`.
 * @param directoryMap Current directoryMap value
 * @param updatedDirs List of updated directories, for convenience
 * @returns `directoryMap` including `updatedDirs` and all children updated
 */
const getNewDirMap = (
  directoryMap: DirectorySlice["directoryMap"],
  updatedDirs: DirectoryJson[]
) => {
  const currentDirList = Object.values(directoryMap);
  const mutableDirMap = { ...directoryMap };

  updatedDirs.forEach((update) => {
    mutableDirMap[update._id] = update;

    const existingEntry = directoryMap[update._id];
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
  return mutableDirMap;
};

export const createDirectorySlice: StateCreator<
  DirectorySlice & ExperimentSlice,
  [],
  [],
  DirectorySlice
> = (set, get) => ({
  directoryMap: {},
  getDirectory: async (id) => {
    const dir = await fetcher<GetDirectoriesId>({
      url: "/api/v2/directories/[id]" as const,
      method: "GET" as const,
      query: { id },
    });
    set((state) => ({
      directoryMap: getNewDirMap(state.directoryMap, [dir]),
    }));
  },
  getDirectoryRoots: async () => {
    const roots = await fetcher<GetDirectoriesRoots>({
      url: "/api/v2/directories/roots" as const,
      method: "GET" as const,
    });
    set((state) => ({
      directoryMap: getNewDirMap(state.directoryMap, roots),
    }));
    return roots;
  },
  getDirectoryContent: async (id) => {
    const content = await fetcher<GetDirectoriesIdChildren>({
      url: "/api/v2/directories/[id]/children" as const,
      method: "GET" as const,
      query: { id },
    });
    set((state) => ({
      directoryMap: getNewDirMap(state.directoryMap, content.directories),
      experimentMap: {
        ...state.experimentMap,
        ...Object.fromEntries(content.experiments.map((exp) => [exp._id, exp])),
      },
    }));
  },
  createDirectory: async (body) => {
    const dir = await fetcher<PostDirectories>({
      url: "/api/v2/directories" as const,
      method: "POST" as const,
      body,
    });
    set((state) => ({
      directoryMap: getNewDirMap(state.directoryMap, [dir]),
    }));
  },
  updateDirectory: async (id, update) => {
    const original = get().directoryMap[id];
    const optimistic = { ...original, ...update };

    set((state) => ({
      directoryMap: getNewDirMap(state.directoryMap, [optimistic]),
    }));

    try {
      const dir = await fetcher<PutDirectoriesId>({
        url: "/api/v2/directories/[id]" as const,
        method: "PUT" as const,
        query: { id },
        body: update,
      });
      set((state) => ({
        directoryMap: getNewDirMap(state.directoryMap, [dir]),
      }));
    } catch {
      set((state) => ({
        directoryMap: getNewDirMap(state.directoryMap, [original]),
      }));
    }
  },
  deleteDirectory: async (id) => {
    const optimisticDirMap = get().directoryMap;

    const dirList = Object.values(optimisticDirMap);
    const subtreePrefix = getPath(optimisticDirMap[id]);

    const deleteQueue = [optimisticDirMap[id]];
    delete optimisticDirMap[id];

    dirList.forEach((dir) => {
      if (!dir.prefixPath.startsWith(subtreePrefix)) {
        return;
      }
      deleteQueue.push(optimisticDirMap[dir._id]);
      delete optimisticDirMap[dir._id];
    });

    set({ directoryMap: optimisticDirMap });

    try {
      await fetcher<DeleteDirectoriesId>({
        url: "/api/v2/directories/[id]",
        method: "DELETE",
        query: {
          id,
        },
      });
    } catch {
      set((state) => ({
        directoryMap: {
          ...state.directoryMap,
          ...Object.fromEntries(deleteQueue.map((dir) => [dir._id, dir])),
        },
      }));
    }
  },
});
