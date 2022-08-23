import { useDrag } from "react-dnd";

import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { ExperimentJson } from "../../../lib/common/models/types";
import { FileTypes } from "./BaseFile";

const Experiment = (experiment: ExperimentJson) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: FileTypes.EXPERIMENT,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItem>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={experiment.name} />
    </ListItem>
  );
};
