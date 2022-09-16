import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import ScienceIcon from "@mui/icons-material/Science";
import { Box, ListItem, ListItemText, styled } from "@mui/material";

import { DirectoryJson, ExperimentJson } from "../../lib/common/models/types";
import { isDirectory } from "../../lib/common/models/utils";

type Props = {
  file: ExperimentJson | DirectoryJson;
  onClick: () => void;
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

const PaddedListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isFolder",
})<{ isFolder: boolean }>(({ isFolder }) => ({
  padding: 0,
  paddingLeft: 24,
  [isFolder ? "&:hover" : "&:hover div"]: {
    backgroundColor: "#333",
  },
}));

const ListItemPadding = styled(Box)({
  display: "flex",
  flex: 1,
  alignItems: "center",
  padding: "4px 8px",
});

export const BaseFile = ({ file, onClick, isExpanded }: Props) => {
  const isFolder = isDirectory(file);

  return (
    <PaddedListItem onClick={onClick} isFolder={isFolder}>
      {isFolder && <DropdownArrow isExpanded={isExpanded} />}
      <ListItemPadding>
        <IconHolder>
          {isFolder ? (
            <FolderIcon fontSize="small" />
          ) : (
            <ScienceIcon fontSize="small" />
          )}
        </IconHolder>
        <ListItemText primary={file.name} />
      </ListItemPadding>
    </PaddedListItem>
  );
};
