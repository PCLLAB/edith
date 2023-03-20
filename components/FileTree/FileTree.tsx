import Tree from "rc-tree";
import { useContext, useEffect } from "react";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import NewDirectoryIcon from "@mui/icons-material/CreateNewFolder";
import DeleteIcon from "@mui/icons-material/Delete";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import FolderIcon from "@mui/icons-material/Folder";
import NewExperimentIcon from "@mui/icons-material/NoteAdd";
import ScienceIcon from "@mui/icons-material/Science";
import {
  Box,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  SxProps,
} from "@mui/material";

import { useDialogContext } from "../../lib/client/context/DialogContext";
import { ExpandedKeysContext } from "../../lib/client/context/ExpandedKeysProvider";
import {
  FileSelectionContext,
  FileType,
} from "../../lib/client/context/FileSelectionProvider";
import { WorkspaceContext } from "../../lib/client/context/WorkspaceProvider";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { getIdFromPath, getPath } from "../../lib/common/utils";
import { ExplorerDialog } from "../../pages/explorer";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { FileActionBar } from "./FileActionBar";
import { buildTree } from "./utils";

type Props = {
  sx?: SxProps;
};

export type TreeItemData = {
  fileType: FileType;
  name: string;
};

export const FileTree = ({ sx }: Props) => {
  const directories = useBoundStore((state) => state.directoryMap);
  const experiments = useBoundStore((state) => state.experimentMap);
  const getDirectoryContent = useBoundStore(
    (state) => state.getDirectoryContent
  );
  const updateExperiment = useBoundStore((state) => state.updateExperiment);
  const updateDirectory = useBoundStore((state) => state.updateDirectory);

  const { workspace } = useContext(WorkspaceContext);

  const onRefresh = () => {
    getDirectoryContent(workspace.rootId);
    // TODO update for all expanded directories?
  };

  useEffect(() => {
    getDirectoryContent(workspace.rootId);
  }, [workspace]);

  const { fileSelection, setFileSelection } = useContext(FileSelectionContext);
  const { expandedKeys, setExpandedKeys } = useContext(ExpandedKeysContext);

  const { openDialog } = useDialogContext<ExplorerDialog>();

  const newFilePrefixPath = fileSelection
    ? fileSelection.type === FileType.DIR
      ? getPath(directories[fileSelection.id])
      : getPath(directories[experiments[fileSelection.id].directory])
    : workspace.rootId;

  return (
    <>
      <Paper elevation={0} sx={sx}>
        <FileActionBar
          onNewDirectory={() =>
            openDialog("CREATE", {
              fileType: FileType.DIR,
              prefixPath: newFilePrefixPath,
            })
          }
          onNewExperiment={() =>
            openDialog("CREATE", {
              fileType: FileType.EXP,
              prefixPath: newFilePrefixPath,
            })
          }
          onRefresh={onRefresh}
        />
        <Box
          sx={{
            overflow: "scroll",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ContextMenu
            renderItems={({ onClose }) => (
              <>
                <MenuItem
                  onClick={() => {
                    openDialog("RENAME", {
                      fileType: fileSelection!.type,
                      id: fileSelection!.id,
                    });
                    onClose();
                  }}
                >
                  <ListItemIcon>
                    <RenameIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Rename</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFileSelection(null);
                    openDialog("DELETE", {
                      fileType: fileSelection!.type,
                      id: fileSelection!.id,
                    });
                    onClose();
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    openDialog("CREATE", {
                      fileType: FileType.DIR,
                      prefixPath: newFilePrefixPath,
                    });
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
                    openDialog("CREATE", {
                      fileType: FileType.EXP,
                      prefixPath: newFilePrefixPath,
                    });
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
                  // https://tree-react-component.vercel.app/demo/draggable-allow-drop
                  const nodePos = node.pos.split("-");
                  const relDropPos =
                    dropPosition - Number(nodePos[nodePos.length - 1]);

                  // If drop above or below, move to same directory instead of inside
                  console.log(node.pos, dropPosition);
                  const destPrefixPath =
                    relDropPos === 0
                      ? getPath(directories[node.key])
                      : directories[node.key].prefixPath;

                  if (dragNode.isLeaf) {
                    const destDirectory = getIdFromPath(destPrefixPath);
                    if (experiments[dragNode.key].directory === destDirectory) {
                      return;
                    }
                    updateExperiment(dragNode.key, {
                      directory: destDirectory,
                    });
                  } else {
                    if (
                      directories[dragNode.key].prefixPath == destPrefixPath
                    ) {
                      return;
                    }
                    updateDirectory(dragNode.key, {
                      prefixPath: destPrefixPath,
                    });
                  }
                }}
                onRightClick={({ node }) => {
                  const fileId = node.key;
                  setFileSelection({
                    id: fileId,
                    type: fileId in directories ? FileType.DIR : FileType.EXP,
                  });
                }}
                // Prevent deselecting files by ignoring empty selection
                onSelect={(s) => {
                  if (!s.length) return;

                  const fileId = s[0] as string;
                  setFileSelection({
                    id: fileId,
                    type: fileId in directories ? FileType.DIR : FileType.EXP,
                  });
                }}
                selectedKeys={fileSelection ? [fileSelection.id] : undefined}
                onExpand={(_, info) => {
                  if (info.node.expanded) {
                    setExpandedKeys((prev) =>
                      prev.filter((key) => key !== info.node.key)
                    );
                  } else {
                    setExpandedKeys((prev) => [...prev, info.node.key]);
                  }
                }}
                expandedKeys={expandedKeys}
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
          <ContextMenu
            sx={{ flex: 1, minHeight: 200 }}
            onClick={() => setFileSelection(null)}
            onContextMenu={() => setFileSelection(null)}
            renderItems={({ onClose }) => (
              <>
                <MenuItem
                  onClick={() => {
                    openDialog("CREATE", {
                      fileType: FileType.DIR,
                      prefixPath: newFilePrefixPath,
                    });
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
                    openDialog("CREATE", {
                      fileType: FileType.EXP,
                      prefixPath: newFilePrefixPath,
                    });
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
        </Box>
      </Paper>
    </>
  );
};
