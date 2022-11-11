import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { updateDirectory } from "../../lib/client/api/directories";
import { updateExperiment } from "../../lib/client/api/experiments";
import { FileType } from "../../lib/client/context/FileSelectionProvider";

const DialogInfo = {
  [FileType.DIR]: { update: updateDirectory, title: "Directory" },
  [FileType.EXP]: { update: updateExperiment, title: "Experiment" },
};

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  type: FileType;
};

export const RenameFileDialog = ({ open, type, onClose, id }: Props) => {
  const [fileName, setFileName] = useState("");

  const handleRename = () => {
    DialogInfo[type].update(id, { name: fileName });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create new {DialogInfo[type].title}</DialogTitle>
      <TextField
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        autoFocus
        margin="dense"
        id="name"
        label={`${type} Name`}
        type="text"
        fullWidth
        variant="outlined"
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRename}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
