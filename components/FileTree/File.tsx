import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import ScienceIcon from "@mui/icons-material/Science";
import { ListItem, ListItemText, styled } from "@mui/material";
import { FileType } from "../../lib/client/context/FileSelectionProvider";

import { DirectoryJson, ExperimentJson } from "../../lib/common/models/types";
import { isDirectory } from "../../lib/common/models/utils";
import { FileTree } from "./FileTree";

type Props = {
  fileData: { fileType: FileType; name: string };
  onClick: () => void;
  onContextMenu: () => void;
  isExpanded: boolean;
};

const IconHolder = styled("div")({
  minWidth: 28,
  display: "inline-flex",
});

const DropdownArrow = styled(ArrowRightIcon, {
  shouldForwardProp: (prop) => prop !== "isExpanded",
})<{ isExpanded: boolean }>((props) => ({
  rotate: props.isExpanded ? "90deg" : undefined,
  transition: "rotate 80ms ease-in",
  position: "absolute",
  left: 4,
}));

const PaddedListItem = styled(ListItem)({
  paddingLeft: 32,
});

export const BaseFile = ({
  fileData,
  onClick,
  isExpanded,
  onContextMenu,
}: Props) => {
  const isFolder = fileData.fileType === FileType.DIR;

  return (
    <PaddedListItem onClick={onClick} onContextMenu={onContextMenu}>
      {isFolder && <DropdownArrow isExpanded={isExpanded} />}
      <IconHolder>
        {isFolder ? (
          <FolderIcon fontSize="small" color="brandYellow" />
        ) : (
          <ScienceIcon fontSize="small" color="brandBlue" />
        )}
      </IconHolder>
      <ListItemText primary={fileData.name} />
    </PaddedListItem>
  );
};
