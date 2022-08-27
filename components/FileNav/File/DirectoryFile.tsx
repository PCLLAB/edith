import { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import FolderIcon from "@mui/icons-material/Folder";
import { ListItem, ListItemIcon, ListItemText, styled } from "@mui/material";

import { DirectoryJson } from "../../../lib/common/models/types";
import { FileTypes } from "./BaseFile";

type Props = {
  directory: DirectoryJson;
};

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isOver",
})<{ isOver: boolean }>(({ theme, isOver }) => ({
  backgroundColor: isOver ? theme.styled.colors.highlight : undefined,
}));

export const DirectoryFile = ({ directory }: Props) => {
  // const [{ isDragging }, drag, preview] = useDrag(() => ({
  //   type: FileTypes.DIRECTORY,
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging,
  //   }),
  //   item: directory,
  // }));

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: [FileTypes.DIRECTORY, FileTypes.EXPERIMENT],
  //   drop: () => {},
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //   }),
  // }));

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  return (
    <StyledListItem
    // ref={(el) => {
    //   drag(el);
    //   drop(el);
    // }}
    // isOver={isOver}
    >
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={directory.name} />
    </StyledListItem>
  );
};
