import FolderIcon from "@mui/icons-material/Folder";
import ScienceIcon from "@mui/icons-material/Science";
import { ListItem, ListItemIcon, ListItemText, styled } from "@mui/material";

import { DirectoryJson, ExperimentJson } from "../../lib/common/models/types";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

type Props = {
  file: ExperimentJson | DirectoryJson;
  onClick: () => void;
  isExpanded: boolean;
};

const IconHolder = styled("div")({
  minWidth: 28,
  display: "inline-flex",
});

const DropdownArrow = styled(ArrowRightIcon)<{ isExpanded: boolean }>(
  (props) => ({
    rotate: props.isExpanded ? "90deg" : undefined,
    transition: "rotate 80ms ease-in",
    position: "absolute",
    left: 4,
  })
);

const PaddedListItem = styled(ListItem)({
  paddingLeft: 32,
});

export const BaseFile = ({ file, onClick, isExpanded }: Props) => {
  const isFolder = "namedPrefixPath" in file;

  return (
    <PaddedListItem onClick={onClick}>
      {isFolder && <DropdownArrow isExpanded={isExpanded} />}
      <IconHolder>
        {isFolder ? (
          <FolderIcon fontSize="small" />
        ) : (
          <ScienceIcon fontSize="small" />
        )}
      </IconHolder>
      <ListItemText primary={file.name} />
    </PaddedListItem>
  );
};
