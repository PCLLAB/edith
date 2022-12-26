import Tree from "rc-tree";
import { useContext, useEffect, useState } from "react";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import NewDirectoryIcon from "@mui/icons-material/CreateNewFolder";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import FolderIcon from "@mui/icons-material/Folder";
import NewExperimentIcon from "@mui/icons-material/NoteAdd";
import ScienceIcon from "@mui/icons-material/Science";
import {
  Dialog,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  styled,
} from "@mui/material";

import {
  getDirectoryContent,
  updateDirectory,
} from "../../lib/client/api/directories";
import {
  FileSelectionContext,
  FileType,
} from "../../lib/client/context/FileSelectionProvider";
import { getIdFromPath, getPath } from "../../lib/common/utils";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { CreateFileDialog } from "../Dialog/CreateFile";
import { RenameFileDialog } from "../Dialog/RenameFile";
import { FileActionBar } from "./FileActionBar";
import { buildTree } from "./utils";
import { updateExperiment } from "../../lib/client/api/experiments";
import { WorkspaceContext } from "../../lib/client/context/WorkspaceProvider";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";

const TreeBase = styled(Paper)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

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
  const directories = useBoundStore((state) => state.directory);
  const experiments = useBoundStore((state) => state.experiment);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { workspace } = useContext(WorkspaceContext);

  const onRefresh = () => {
    getDirectoryContent(workspace.rootId);
    // TODO update for all expanded directories?
  };

  useEffect(() => {
    getDirectoryContent(workspace.rootId);
  }, [workspace]);

  // skip 0, because its falsey
  enum Dialogs {
    CREATE_EXP = 1,
    CREATE_DIR,
    RENAME,
  }
  const [dialog, setDialog] = useState<Dialogs | null>(null);
  const onCloseDialog = () => setDialog(null);

  const { fileSelection, setFileSelection } = useContext(FileSelectionContext);

  const newFilePrefixPath = fileSelection
    ? fileSelection.type === FileType.DIR
      ? getPath(directories[fileSelection.id])
      : getPath(directories[experiments[fileSelection.id].directory])
    : workspace.rootId;

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
                  setDialog(Dialogs.RENAME);
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
        >
          <List dense disablePadding>
            <Tree
              showLine
              draggable
              treeData={buildTree(
                workspace.rootId,
                Object.values(experiments),
                Object.values(directories)
              )}
              allowDrop={(s) => !s.dropNode.isLeaf}
              onDrop={({ dragNode, node, dropPosition }) => {
                // If drop above, move to same directory instead of inside
                const destPrefixPath =
                  dropPosition < 0
                    ? directories[node.key].prefixPath
                    : getPath(directories[node.key]);

                if (dragNode.isLeaf) {
                  const destDirectory = getIdFromPath(destPrefixPath);
                  if (experiments[dragNode.key].directory === destDirectory) {
                    return;
                  }
                  updateExperiment(dragNode.key, { directory: destDirectory });
                } else {
                  if (directories[dragNode.key].prefixPath == destPrefixPath) {
                    return;
                  }
                  updateDirectory(dragNode.key, { prefixPath: destPrefixPath });
                }
              }}
              onRightClick={({ node }) => {
                setSelectedKeys([node.key]);
                const fileId = node.key;
                setFileSelection({
                  id: fileId,
                  type: fileId in directories ? FileType.DIR : FileType.EXP,
                });
              }}
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
                node.isLeaf ? (
                  <ScienceIcon fontSize="small" color="primary" />
                ) : (
                  <FolderIcon fontSize="small" color="secondary" />
                )
              }
              /**
               * For all above props, directories will not have isLeaf, and
               * it seems to match what we input for treeData
               * however, leaf directories will have isLeaf: true here
               */
              switcherIcon={(node) =>
                node.isLeaf ? null : (
                  <ArrowRightIcon
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
      {/*
      //@ts-ignore: enums are numbers */}
      <Dialog open={dialog!!} onClose={onCloseDialog} fullWidth maxWidth="sm">
        {fileSelection && dialog === Dialogs.RENAME ? (
          <RenameFileDialog
            onClose={onCloseDialog}
            id={fileSelection.id}
            type={fileSelection.type}
          />
        ) : (
          (dialog === Dialogs.CREATE_EXP || dialog === Dialogs.CREATE_DIR) && (
            <CreateFileDialog
              onClose={onCloseDialog}
              prefixPath={newFilePrefixPath}
              type={dialog === Dialogs.CREATE_DIR ? FileType.DIR : FileType.EXP}
            />
          )
        )}
      </Dialog>
    </>
  );
};
