import { useCallback, useEffect, useMemo, useState } from "react";

import Tree, { ItemId, mutateTree, TreeData, TreeItem } from "@atlaskit/tree";
import { List } from "@mui/material";

import {
  AnyDirectory,
  DirectoryFile,
  DirectoryJson,
  ExperimentJson,
} from "../../lib/common/models/types";
import {
  getIdFromPath,
  getPath,
  isDirectory,
  ROOT_DIRECTORY,
} from "../../lib/common/models/utils";
import { BaseFile } from "./File";

const testDirs: DirectoryJson[] = [
  {
    _id: "dirid",
    name: "level 1",
    ownerIds: [],
    namedPrefixPath: "Root",
    prefixPath: "r",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "dirid2",
    name: "level 1.2",
    ownerIds: [],
    namedPrefixPath: "Root",
    prefixPath: "r",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "dirid3",
    name: "level 1.2",
    ownerIds: [],
    namedPrefixPath: "Root,level 1",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
];

const testExps2: ExperimentJson[] = [
  {
    _id: "second",
    name: "zsecond Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "third",
    name: "third Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "fourth",
    name: "fourth Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid2",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
];

const testExps: ExperimentJson[] = [
  {
    _id: "o2wd8",
    name: "First Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
];

type Props = {
  selectFile: (fileId: string) => void;
};

const FileTree = ({ selectFile }: Props) => {
  const [tree, setTree] = useState<TreeData<DirectoryFile>>({
    rootId: ROOT_DIRECTORY._id,
    items: {
      [ROOT_DIRECTORY._id]: {
        id: ROOT_DIRECTORY._id,
        children: [],
        data: ROOT_DIRECTORY as DirectoryFile,
      },
    },
  });

  const [currentDir, setCurrentDir] = useState<AnyDirectory>(ROOT_DIRECTORY);
  // const {
  //   content: retrievedContent,
  //   error,
  //   loading,
  // } = useDirectoryContent(directoryId);

  const retrievedContent = useMemo(() => {
    return {
      experiments: testExps2,
      directories: testDirs,
      // experiments: !bool ? testExps2 : [], //testExps2,
      // directories: !bool ? testDirs : [],
    };
  }, []);

  useEffect(() => {
    if (retrievedContent == null) return;

    const updatedPath = getPath(currentDir);

    const treeItems = tree.items;

    const keepEntries = Object.entries(treeItems).filter(
      ([fileId, treeItem]) => treeItem.data?.prefixPath !== updatedPath
    );

    const newExpEntries = retrievedContent.experiments.map((exp) => [
      exp._id,
      {
        id: exp._id,
        data: exp,
        isExpanded: false,
        hasChildren: false,
        children: [],
      },
    ]);

    const newDirExtries = retrievedContent.directories.map((dir) => [
      dir._id,
      {
        id: dir._id,
        data: dir,
        isExpanded: false,
        hasChildren: true,
        children: treeItems[dir._id]?.children ?? [],
      },
    ]);

    const newItems: Record<
      string,
      TreeItem<DirectoryFile>
    > = Object.fromEntries([
      ...keepEntries,
      ...newDirExtries,
      ...newExpEntries,
    ]);

    // Display order is stored in children array order

    const compareFile = (itemA: string, itemB: string) => {
      const fileA = newItems[itemA];
      const fileB = newItems[itemB];
      const aFolder = "namedPrefixPath" in fileA;
      const bFolder = "namedPrefixPath" in fileB;

      if (aFolder !== bFolder) {
        return aFolder ? 1 : -1;
      }

      return fileA.data.name.localeCompare(fileB.data.name);
    };

    [...retrievedContent.directories, ...retrievedContent.experiments].forEach(
      (file) => {
        const parentId = getIdFromPath(file.prefixPath);
        if (!newItems[parentId].children.includes(file._id)) {
          newItems[parentId].children.push(file._id);
          newItems[parentId].children.sort(compareFile);
        }
      }
    );

    setTree({ rootId: ROOT_DIRECTORY._id, items: newItems });
    // `treeItems` should only change as a result of
    // this useEffect, so it shouldn't be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievedContent]);

  const onExpand = useCallback((fileId: ItemId) => {
    setTree((tree) => mutateTree(tree, fileId, { isExpanded: true }));
  }, []);

  const onCollapse = useCallback((fileId: ItemId) => {
    setTree((tree) => mutateTree(tree, fileId, { isExpanded: false }));
  }, []);

  return (
    <List dense>
      <Tree
        tree={tree}
        onExpand={onExpand}
        onCollapse={onCollapse}
        renderItem={({ item, onExpand, onCollapse, provided, snapshot }) => {
          const onClick = isDirectory(item.data)
            ? item.isExpanded
              ? () => onCollapse(item.id)
              : () => onExpand(item.id)
            : () => selectFile(item.id);

          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <BaseFile
                file={item.data}
                onClick={onClick}
                isExpanded={!!item.isExpanded}
              />
            </div>
          );
        }}
        offsetPerLevel={20}
        isDragEnabled={true}
        isNestingEnabled={true}
      />
    </List>
  );
};

export default FileTree;
