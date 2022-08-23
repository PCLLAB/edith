import { useDrag, useDrop } from "react-dnd";

import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { DirectoryJson } from "../../../lib/common/models/types";
import { FileTypes } from "./BaseFile";

const Directory = (directory: DirectoryJson) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: FileTypes.DIRECTORY,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging,
    }),
  }));

  const [{}, drop] = useDrop(() => ({
    accept: [FileTypes.DIRECTORY, FileTypes.EXPERIMENT],
    drop: () => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <ListItem>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={directory.name} />
    </ListItem>
  );
};
