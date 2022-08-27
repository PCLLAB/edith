import Tree, {
  ItemId,
  mutateTree,
  Path,
  TreeData,
  TreeItem,
} from "@atlaskit/tree";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  DirectoryJson,
  ExperimentJson,
  AnyDirectory,
} from "../../lib/common/models/types";
import {
  ROOT_DIRECTORY,
  getPath,
  getIdFromPath,
} from "../../lib/common/models/utils";
import { DirectoryFile } from "./File/DirectoryFile";
import { ExperimentFile } from "./File/ExperimentFile";

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
];

const testExps2: ExperimentJson[] = [
  {
    _id: "asf8io",
    name: "second Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "a08i3k",
    name: "third Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "o2wd8sdf",
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

declare module "@atlaskit/tree" {
  export type TreeItemData = DirectoryJson | ExperimentJson;
  export type ItemId = string;
  // export interface TreeItem {
  //   data: TreeItemData;
  // }
}
const FileTree = () => {
  const [tree, setTree] = useState<TreeData>({
    rootId: ROOT_DIRECTORY._id,
    items: {
      [ROOT_DIRECTORY._id]: {
        id: ROOT_DIRECTORY._id,
        children: [],
        data: ROOT_DIRECTORY,
      },
    },
  });

  const [currentDir, setCurrentDir] = useState<AnyDirectory>(ROOT_DIRECTORY);
  // const {
  //   content: retrievedContent,
  //   error,
  //   loading,
  // } = useDirectoryContent(directoryId);

  const [bool, setBool] = useState(true);

  const retrievedContent = useMemo(() => {
    return {
      experiments: bool ? testExps : [], //testExps2,
      directories: bool ? testDirs : [],
    };
  }, [bool]);

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

    const newItems: Record<string, TreeItem> = Object.fromEntries([
      ...keepEntries,
      ...newExpEntries,
      ...newDirExtries,
    ]);

    retrievedContent.experiments.forEach((exp) => {
      const parentId = getIdFromPath(exp.prefixPath);
      if (!newItems[parentId].children.includes(exp._id)) {
        newItems[parentId].children.push(exp._id);
      }
    });
    retrievedContent.directories.forEach((dir) => {
      const parentId = getIdFromPath(dir.prefixPath);
      if (!newItems[parentId].children.includes(dir._id)) {
        newItems[parentId].children.push(dir._id);
      }
    });

    setTree({ rootId: ROOT_DIRECTORY._id, items: newItems });
    setBool(false);
    // `treeItems` should only change as a result of
    // this useEffect, so it shouldn't be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievedContent]);

  // mutateTree();
  // console.log(treeItems);

  const onExpand = useCallback((fileId: ItemId) => {
    setTree((tree) => mutateTree(tree, fileId, { isExpanded: true }));
  }, []);

  const onCollapse = useCallback((fileId: ItemId) => {
    setTree((tree) => mutateTree(tree, fileId, { isExpanded: false }));
  }, []);

  return (
    <Tree
      tree={tree}
      onExpand={onExpand}
      onCollapse={onCollapse}
      renderItem={({ item, onExpand, onCollapse, provided, snapshot }) => {
        console.log("renderItem", item);
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {"namedPrefixPath" in item.data ? (
              <DirectoryFile directory={item.data} />
            ) : (
              <ExperimentFile experiment={item.data} />
            )}
          </div>
        );
      }}
      // offsetPerLevel
      isDragEnabled={true}
      isNestingEnabled={true}
    />
  );
};

export default FileTree;
