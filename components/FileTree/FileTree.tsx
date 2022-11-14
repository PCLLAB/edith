import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
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
import FolderIcon from "@mui/icons-material/Folder";
import ScienceIcon from "@mui/icons-material/Science";

import { getDirectoryContent } from "../../lib/client/api/directories";
import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";
import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";
import { getPath, ROOT_DIRECTORY } from "../../lib/common/models/utils";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { CreateFileDialog } from "../Dialog/CreateFile";
import { BaseFile } from "./File";
import { FileActionBar } from "./FileActionBar";
import {
  FileType,
  FileSelectionContext,
} from "../../lib/client/context/FileSelectionProvider";
import { buildTree, INITIAL_TREE_DATA, updatedTreeItems } from "./utils";
import { RenameFileDialog } from "../Dialog/RenameFile";
import Tree, { TreeNode } from "rc-tree";

const TreeBase = styled(Paper)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
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
  flex: 1,
});

type Props = {
  className?: string;
};

export type TreeItemData = {
  fileType: FileType;
  name: string;
};

export const FileTree = ({ className }: Props) => {
  const directories = useDirectoryStore((state) => state.directories);
  // const updateDirectories = useDirectoryStore(
  //   (state) => state.updateDirectories
  // );
  const experiments = useExperimentStore((state) => state.experiments);
  // const updateExperiments = useExperimentStore(
  //   (state) => state.updateExperiments
  // );
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

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

  const newFilePrefixPath = fileSelection
    ? fileSelection.type === FileType.DIR
      ? getPath(directories[fileSelection.id])
      : experiments[fileSelection.id].prefixPath
    : ROOT_DIRECTORY._id;

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
              showLine
              draggable
              treeData={buildTree(
                Object.values(experiments),
                Object.values(directories)
              )}
              /** before data normalized */
              allowDrop={(s) => !s.dropNode.isLeaf}
              // Prevent deselecting files by ignoring empty selection
              onSelect={(s) => {
                if (!s.length) return;
                setSelectedKeys(s as string[]);
                const fileId = s[0] as string;
                setFileSelection({
                  id: fileId,
                  type: fileId in directories ? FileType.DIR : FileType.EXP,
                });
              }}
              selectedKeys={selectedKeys}
              icon={(node) =>
                /**
                 * Icons are rendered before the data is normalized,
                 * so this is used to render the correct icons,
                 * however, directories will also have isLeaf: true
                 */
                node.isLeaf ? (
                  <ScienceIcon fontSize="small" color="primary" />
                ) : (
                  <FolderIcon fontSize="small" color="secondary" />
                )
              }
              /** after data normalized */
              switcherIcon={(node) =>
                node.isLeaf ? null : (
                  <ArrowRightIcon
                    fontSize="small"
                    sx={{
                      rotate: node.expanded ? "90deg" : null,
                      transition: "100ms",
                    }}
                  />
                )
              }
            />
          </List>
        </ContextMenu>
        <FillSpaceContextMenu
          renderItems={({ onClose }) => (
            <>
              <MenuItem
                onClick={() => {
                  setDialog(Dialogs.CREATE_DIR);
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
                  setDialog(Dialogs.CREATE_EXP);
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
      <CreateFileDialog
        open={dialog === Dialogs.CREATE_DIR || dialog === Dialogs.CREATE_EXP}
        onClose={onCloseDialog}
        prefixPath={newFilePrefixPath}
        type={dialog === Dialogs.CREATE_DIR ? FileType.DIR : FileType.EXP}
      />
      {fileSelection && (
        <RenameFileDialog
          open={dialog === (Dialogs.RENAME_DIR || Dialogs.RENAME_EXP)}
          onClose={onCloseDialog}
          id={fileSelection.id}
          type={fileSelection.type}
        />
      )}
    </>
  );
};
