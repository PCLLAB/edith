import { useDrag } from "react-dnd";

import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { ExperimentJson } from "../../../lib/common/models/types";
import { FileTypes } from "./BaseFile";

type Props = {
  experiment: ExperimentJson;
};

export const ExperimentFile = ({ experiment }: Props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: FileTypes.EXPERIMENT,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItem ref={drag}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={experiment.name} />
    </ListItem>
  );
};
