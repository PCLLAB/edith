import { TreeData, TreeItem } from "@atlaskit/tree";

import {
  DirectoryFile,
  DirectoryJson,
  ExperimentJson,
} from "../../lib/common/models/types";
import { getIdFromPath, ROOT_DIRECTORY } from "../../lib/common/models/utils";
import { DirectoryFileType } from "./FileSelectionProvider";
import { TreeItemData } from "./FileTree";

export const INITIAL_TREE_DATA = {
  rootId: ROOT_DIRECTORY._id,
  items: {
    [ROOT_DIRECTORY._id]: {
      id: ROOT_DIRECTORY._id,
      children: [],
      data: {
        fileType: DirectoryFileType.DIR,
        name: ROOT_DIRECTORY.name,
      },
    },
  },
};

export const updatedTreeItems = (
  treeItems: TreeData["items"],
  experiments: ExperimentJson[],
  directories: DirectoryJson[]
) => {
  const keepEntries: [string, TreeItem][] = [
    [ROOT_DIRECTORY._id, treeItems[ROOT_DIRECTORY._id]],
  ];

  const filterFiles = (files: DirectoryFile[]) =>
    files.filter((file) => {
      if (file._id in treeItems) {
        if (
          treeItems[file._id].data.prefixPath === file.prefixPath &&
          treeItems[file._id].data.name === file.name
        ) {
          keepEntries.push([file._id, treeItems[file._id]]);
          return false;
        }
      }
      return true;
    });

  const newExps = filterFiles(Object.values(experiments));
  const newDirs = filterFiles(Object.values(directories));

  const newExpEntries = newExps.map((exp) => [
    exp._id,
    {
      id: exp._id,
      data: { fileType: DirectoryFileType.EXP },
      isExpanded: false,
      hasChildren: false,
      children: [],
    },
  ]);

  const newDirExtries = newDirs.map((dir) => [
    dir._id,
    {
      id: dir._id,
      data: { fileType: DirectoryFileType.DIR },
      isExpanded: false,
      hasChildren: true,
      children: treeItems[dir._id]?.children ?? [],
    },
  ]);

  const newItems: Record<string, TreeItem<TreeItemData>> = Object.fromEntries([
    ...keepEntries,
    ...newDirExtries,
    ...newExpEntries,
  ]);

  // Display order is stored in children array order

  const compareFile = (itemA: string, itemB: string) => {
    const fileA = newItems[itemA];
    const fileB = newItems[itemB];
    const aFolder = fileA.data.fileType === DirectoryFileType.DIR;
    const bFolder = fileB.data.fileType === DirectoryFileType.EXP;

    if (aFolder !== bFolder) {
      return aFolder ? 1 : -1;
    }

    return fileA.data.name.localeCompare(fileB.data.name);
  };

  [...newExps, ...newDirs].forEach((file) => {
    const parentId = getIdFromPath(file.prefixPath);
    if (!newItems[parentId].children.includes(file._id)) {
      newItems[parentId].children.push(file._id);
    }
  });

  Object.values(directories).forEach((dir) => {
    newItems[dir._id].children.sort(compareFile);
  });

  return newItems;
};
