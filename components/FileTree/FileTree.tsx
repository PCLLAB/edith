import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";

import { ItemId, mutateTree, TreeData } from "@atlaskit/tree";
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

// @ts-ignore: this doesn't actually cause any errors
const Tree = dynamic(() => import("@atlaskit/tree"), { ssr: false });

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
  console.debug("FileTree render");
  // const [tree, setTree] = useState<TreeData<TreeItemData>>(INITIAL_TREE_DATA);

  const directories = useDirectoryStore((state) => state.directories);
  // const updateDirectories = useDirectoryStore(
  //   (state) => state.updateDirectories
  // );
  const experiments = useExperimentStore((state) => state.experiments);
  // const updateExperiments = useExperimentStore(
  //   (state) => state.updateExperiments
  // );

  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const baseTree = {
    rootId: ROOT_DIRECTORY._id,
    items: buildTree(Object.values(experiments), Object.values(directories)),
  };

  const expandedDirIds = Object.entries(isExpanded)
    .filter(([_, expanded]) => expanded)
    .map(([key, _]) => key);

  const tree = expandedDirIds.reduce(
    (modifiedTree, dirId) =>
      mutateTree(modifiedTree, dirId, { isExpanded: true }),
    baseTree
  );

  // useEffect(() => {
  //   setTree({
  //     rootId: ROOT_DIRECTORY._id,
  //     items: updatedTreeItems(
  //       tree.items,
  //       Object.values(experiments),
  //       Object.values(directories)
  //     ),
  //   });
  //   console.debug("useEffect");
  //   // `treeItems` should only change as a result of
  //   // this useEffect, so it shouldn't be a dependency
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [directories, experiments]);

  const onExpand = (fileId: ItemId) => {
    console.debug("expant");
    // setTree((tree) => mutateTree(tree, fileId, { isExpanded: true }));
    // mutateTree(tree, fileId, { isExpanded: true })
    // getDirectoryContent(fileId);
    setIsExpanded({ ...isExpanded, [fileId]: true });
  };

  const onCollapse = (fileId: ItemId) => {
    console.debug("collaps");
    setIsExpanded({ ...isExpanded, [fileId]: false });
  };

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
                  if (item.data.fileType === FileType.DIR) {
                    item.isExpanded ? onCollapse(item.id) : onExpand(item.id);
                  }
                  if (fileSelection?.id !== item.id) {
                    setFileSelection({ id: item.id, type: item.data.fileType });
                  }
                };
                const onContextMenu = () => {
                  if (fileSelection?.id !== item.id) {
                    setFileSelection({ id: item.id, type: item.data.fileType });
                  }
                };

                return (
                  <TreeItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <BaseFile
                      fileData={item.data}
                      onClick={onClick}
                      onContextMenu={onContextMenu}
                      isExpanded={!!item.isExpanded}
                    />
                  </TreeItem>
                );
              }}
              offsetPerLevel={17} // Line up files' left border line with center of dropdown arrow
              isDragEnabled
              isNestingEnabled
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
