import { useDrag } from "react-dnd";

import FolderIcon from "@mui/icons-material/Folder";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { ExperimentJson } from "../../../lib/common/models/types";
import { FileTypes } from "./BaseFile";
import { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

type Props = {
  experiment: ExperimentJson;
};

export const ExperimentFile = ({ experiment }: Props) => {
  // const [{ isDragging }, drag, preview] = useDrag(() => ({
  //   type: FileTypes.EXPERIMENT,
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  //   item: experiment,
  // }));

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  return (
    // <ListItem ref={drag}>
    <ListItem>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={experiment.name} />
    </ListItem>
  );
};
