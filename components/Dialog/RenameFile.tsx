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

type Props = {
  open: boolean;
  onClose: () => void;
};

const RenameFileDialog = ({
  open,
  type,
  onClose,
  onRename,
}: Props & {
  onRename: (name: string) => void;
  type: "Experiment" | "Directory";
}) => {
  const [fileName, setFileName] = useState("");

  const handleRename = () => {
    onRename(fileName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new {type}</DialogTitle>
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

export const RenameExperimentDialog = ({
  open,
  onClose,
  id,
}: Props & { id: string }) => {
  const handleRename = (name: string) => {
    updateExperiment(id, { name, prefixPath, enabled: false });
  };
  return (
    <RenameFileDialog
      open={open}
      onClose={onClose}
      type="Experiment"
      onRename={handleRename}
    />
  );
};
export const RenameDirectoryDialog = ({
  open,
  onClose,
  id,
}: Props & { id: string }) => {
  const handleRename = (name: string) => {
    updateDirectory(id, { name });
  };
  return (
    <RenameFileDialog
      open={open}
      onClose={onClose}
      type="Directory"
      onRename={handleRename}
    />
  );
};
