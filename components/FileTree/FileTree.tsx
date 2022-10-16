import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

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

import { getDirectoryContent } from "../../lib/client/api/directories";
import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";
import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";
import { DirectoryFile } from "../../lib/common/models/types";
import { isDirectory, ROOT_DIRECTORY } from "../../lib/common/models/utils";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import {
  CreateDirectoryDialog,
  CreateExperimentDialog,
} from "../Dialog/CreateFile/CreateFile";
import { BaseFile } from "./File";
import { FileActionBar } from "./FileActionBar";
import { INITIAL_TREE_DATA, updatedTreeItems } from "./utils";

// @ts-ignore: this doesn't actually cause any errors
const Tree = dynamic(() => import("@atlaskit/tree"), { ssr: false });

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

const FillSpaceContextMenu = styled(ContextMenu)({
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
  const [tree, setTree] = useState<TreeData<DirectoryFile>>(INITIAL_TREE_DATA);

  const directories = useDirectoryStore((state) => state.directories);
  const updateDirectories = useDirectoryStore(
    (state) => state.updateDirectories
  );
  const experiments = useExperimentStore((state) => state.experiments);
  const updateExperiments = useExperimentStore(
    (state) => state.updateExperiments
  );

  useEffect(() => {
    // updatedirectories(testdirs);
    // updateexperiments(testexps2);
  }, []);

  useEffect(() => {
    setTree({
      rootId: ROOT_DIRECTORY._id,
      items: updatedTreeItems(
        tree.items,
        Object.values(experiments),
        Object.values(directories)
      ),
    });
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
    <>
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
        <FillSpaceContextMenu
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
      <CreateDirectoryDialog open={} onClose={} prefixPath={} />
      <CreateExperimentDialog open={} onClose={} prefixPath={} />
    </>
  );
};
