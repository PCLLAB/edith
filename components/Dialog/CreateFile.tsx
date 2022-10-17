import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { createDirectory } from "../../lib/client/api/directories";
import { createExperiment } from "../../lib/client/api/experiments";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateFileDialog = ({
  open,
  type,
  onClose,
  onCreate,
}: Props & {
  onCreate: (name: string) => void;
  type: "Experiment" | "Directory";
}) => {
  const [fileName, setFileName] = useState("");

  const handleCreate = () => {
    onCreate(fileName);
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
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export const CreateExperimentDialog = ({
  open,
  onClose,
  prefixPath,
}: Props & { prefixPath: string }) => {
  const handleCreate = (name: string) => {
    createExperiment({ name, prefixPath, enabled: false });
  };
  return (
    <CreateFileDialog
      open={open}
      onClose={onClose}
      type="Experiment"
      onCreate={handleCreate}
    />
  );
};
export const CreateDirectoryDialog = ({
  open,
  onClose,
  prefixPath,
}: Props & { prefixPath: string }) => {
  const handleCreate = (name: string) => {
    createDirectory({ name, prefixPath });
  };
  return (
    <CreateFileDialog
      open={open}
      onClose={onClose}
      type="Directory"
      onCreate={handleCreate}
    />
  );
};
