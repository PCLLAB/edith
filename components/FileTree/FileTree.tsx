import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ItemId, mutateTree, TreeData, TreeItem } from "@atlaskit/tree";
import NewDirectoryIcon from "@mui/icons-material/CreateNewFolder";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import NewExperimentIcon from "@mui/icons-material/NoteAdd";
import {
  Box,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  styled,
} from "@mui/material";

import {
  DirectoryFile,
  DirectoryJson,
  ExperimentJson,
  RootDirectory,
} from "../../lib/common/models/types";
import {
  getIdFromPath,
  getPath,
  isDirectory,
  ROOT_DIRECTORY,
} from "../../lib/common/models/utils";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { BaseFile } from "./File";
import { FileActionBar } from "./FileActionBar";
import { getDirectoryContent } from "../../lib/client/api/directories";
import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";
import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";

// @ts-ignore: this doesn't actually cause any errors
const Tree = dynamic(() => import("@atlaskit/tree"), { ssr: false });

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
    _id: "nested guy",
    name: "nested nested Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid,dirid3",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
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

const TreeBase = styled(Paper)({
  height: "100%",
});

const TreeItem = styled(Box)((props) => ({
  "&:hover": {
    backgroundColor: props.theme.palette.action.hover,
  },
  "& > *": {
    borderLeft: `1px solid ${props.theme.palette.action.hover}`,
  },
}));

const ExpandContextMenu = styled(ContextMenu)({
  height: "100%",
});

type Props = {
  selectDirectory: (fileId: string) => void;
  selectExperiment: (fileId: string) => void;
  // selectedFile: DirectoryFile | null;
  className?: string;
};

export const FileTree = ({
  selectDirectory,
  selectExperiment,
  className,
}: Props) => {
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

  const directories = useDirectoryStore((state) => state.directories);
  const updateDirectories = useDirectoryStore(
    (state) => state.updateDirectories
  );
  const experiments = useExperimentStore((state) => state.experiments);
  const updateExperiments = useExperimentStore(
    (state) => state.updateExperiments
  );

  useEffect(() => {
    updateDirectories(testDirs);
    updateExperiments(testExps2);
  }, []);

  useEffect(() => {
    const treeItems = tree.items;

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
        data: exp,
        isExpanded: false,
        hasChildren: false,
        children: [],
      },
    ]);

    const newDirExtries = newDirs.map((dir) => [
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

    [...newExps, ...newDirs].forEach((file) => {
      const parentId = getIdFromPath(file.prefixPath);
      if (!newItems[parentId].children.includes(file._id)) {
        newItems[parentId].children.push(file._id);
      }
    });

    Object.values(directories).forEach((dir) => {
      newItems[dir._id].children.sort(compareFile);
    });

    setTree({ rootId: ROOT_DIRECTORY._id, items: newItems });
    // `treeItems` should only change as a result of
    // this useEffect, so it shouldn't be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directories, experiments]);

  const onExpand = useCallback((fileId: ItemId) => {
    setTree((tree) => mutateTree(tree, fileId, { isExpanded: true }));
    getDirectoryContent(fileId);
  }, []);

  const onCollapse = useCallback((fileId: ItemId) => {
    setTree((tree) => mutateTree(tree, fileId, { isExpanded: false }));
  }, []);

  const onNewDirectory = () => {};
  const onNewExperiment = () => {};
  const onRefresh = () => {};

  return (
    <TreeBase elevation={0} className={className}>
      <FileActionBar
        onNewDirectory={onNewDirectory}
        onNewExperiment={onNewExperiment}
        onRefresh={onRefresh}
      />
      <ContextMenu
        renderItems={({ onClose }) => (
          <>
            <MenuItem onClick={onClose}>
              <ListItemIcon>
                <RenameIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Rename</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClose}>
              <ListItemIcon>
                <NewDirectoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Folder</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClose}>
              <ListItemIcon>
                <NewExperimentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Experiment</ListItemText>
            </MenuItem>
          </>
        )}
      >
        <List dense disablePadding>
          <Tree
            tree={tree}
            onExpand={onExpand}
            onCollapse={onCollapse}
            renderItem={({
              item,
              onExpand,
              onCollapse,
              provided,
              snapshot,
            }) => {
              const onClick = () => {
                if (isDirectory(item.data)) {
                  selectDirectory(item.id);
                  item.isExpanded ? onCollapse(item.id) : onExpand(item.id);
                } else {
                  selectExperiment(item.id);
                }
              };
              const onContextMenu = () =>
                isDirectory(item.data)
                  ? selectDirectory(item.id)
                  : selectExperiment(item.id);

              return (
                <TreeItem
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <BaseFile
                    file={item.data}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    isExpanded={!!item.isExpanded}
                  />
                </TreeItem>
              );
            }}
            offsetPerLevel={17} // Line up files' left border line with center of dropdown arrow
            isDragEnabled={true}
            isNestingEnabled={true}
          />
        </List>
      </ContextMenu>
      <ExpandContextMenu
        renderItems={({ onClose }) => (
          <>
            <MenuItem onClick={onClose}>
              <ListItemIcon>
                <NewDirectoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Folder</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClose}>
              <ListItemIcon>
                <NewExperimentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Experiment</ListItemText>
            </MenuItem>
          </>
        )}
      />
    </TreeBase>
  );
};
