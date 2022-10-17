import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";

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
} from "../Dialog/CreateFile";
import { BaseFile } from "./File";
import { FileActionBar } from "./FileActionBar";
import { INITIAL_TREE_DATA, updatedTreeItems } from "./utils";
import {
  DirectoryFileType,
  FileSelectionContext,
} from "./FileSelectionProvider";
import { RenameDirectoryDialog } from "../Dialog/RenameFile";

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
  // selectedFile: DirectoryFile | null;
  className?: string;
};

export type TreeItemData = {
  fileType: DirectoryFileType;
  name: string;
};

export const FileTree = ({ className }: Props) => {
  const [tree, setTree] = useState<TreeData<TreeItemData>>(INITIAL_TREE_DATA);

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

  // const onNewDirectory = () => {};
  // const onNewExperiment = () => {};
  const onRefresh = () => {
    getDirectoryContent(ROOT_DIRECTORY._id);
    // TODO update for all expanded directories?
  };

  enum Dialogs {
    CREATE_EXP,
    CREATE_DIR,
    RENAME_EXP,
    RENAME_DIR,
  }
  const [dialog, setDialog] = useState<Dialogs | null>(null);
  const onCloseDialog = () => setDialog(null);

  const { fileSelection, setFileSelection } = useContext(FileSelectionContext);

  return (
    <>
      <TreeBase elevation={0} className={className}>
        <FileActionBar
          onNewDirectory={() => setDialog(Dialogs.CREATE_DIR)}
          onNewExperiment={() => setDialog(Dialogs.CREATE_EXP)}
          onRefresh={onRefresh}
        />
        <ContextMenu
          renderItems={({ onClose }) => (
            <>
              <MenuItem
                onClick={() => {
                  setDialog(Dialogs.RENAME_DIR);
                  onClose();
                }}
              >
                <ListItemIcon>
                  <RenameIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  () => setDialog(Dialogs.CREATE_DIR);
                  onClose();
                }}
              >
                <ListItemIcon>
                  <NewDirectoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>New Folder</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  () => setDialog(Dialogs.CREATE_EXP);
                  onClose();
                }}
              >
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
                  if (item.data.fileType === DirectoryFileType.DIR) {
                    item.isExpanded ? onCollapse(item.id) : onExpand(item.id);
                  }
                  setFileSelection({ id: item.id, type: item.data.fileType });
                };
                const onContextMenu = () =>
                  setFileSelection({ id: item.id, type: item.data.fileType });

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
              <MenuItem
                onClick={() => {
                  () => setDialog(Dialogs.CREATE_DIR);
                  onClose();
                }}
              >
                <ListItemIcon>
                  <NewDirectoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>New Folder</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  () => setDialog(Dialogs.CREATE_EXP);
                  onClose();
                }}
              >
                <ListItemIcon>
                  <NewExperimentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>New Experiment</ListItemText>
              </MenuItem>
            </>
          )}
        />
      </TreeBase>
      <CreateDirectoryDialog
        open={dialog === Dialogs.CREATE_DIR}
        onClose={onCloseDialog}
        prefixPath={
          experiments[fileSelection?.id ?? ROOT_DIRECTORY._id].prefixPath
        }
      />
      <CreateExperimentDialog
        open={dialog === Dialogs.CREATE_EXP}
        onClose={onCloseDialog}
        prefixPath={
          directories[fileSelection?.id ?? ROOT_DIRECTORY._id].prefixPath
        }
      />
    </>
  );
};
