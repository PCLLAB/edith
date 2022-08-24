import { useDrag, useDrop } from "react-dnd";
import styled from "@emotion/styled";
import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { DirectoryJson } from "../../../lib/common/models/types";
import { FileTypes } from "./BaseFile";

type Props = {
  directory: DirectoryJson;
};

const StyledListItem = styled(ListItem)<{ isOver: boolean }>`
  background-color: ${(props) =>
    props.isOver ? props.theme.colors.highlight : undefined};
`;

export const DirectoryFile = ({ directory }: Props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: FileTypes.DIRECTORY,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging,
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [FileTypes.DIRECTORY, FileTypes.EXPERIMENT],
    drop: () => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <StyledListItem
      ref={(el) => {
        drag(el);
        drop(el);
      }}
      isOver={isOver}
    >
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={directory.name} />
    </StyledListItem>
  );
};
