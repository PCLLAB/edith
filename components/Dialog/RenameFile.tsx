import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { updateDirectory } from "../../lib/client/api/directories";
import { updateExperiment } from "../../lib/client/api/experiments";
import { FileType } from "../../lib/client/context/FileSelectionProvider";
import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";
import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";

const DialogInfo = {
  [FileType.DIR]: { update: updateDirectory, title: "directory" },
  [FileType.EXP]: { update: updateExperiment, title: "experiment" },
};

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  type: FileType;
};

export const RenameFileDialog = ({ open, type, onClose, id }: Props) => {
  const [fileName, setFileName] = useState("");

  const handleClose = () => {
    setFileName("");
    onClose();
  };

  const handleRename = () => {
    DialogInfo[type].update(id, { name: fileName });
    onClose();
  };

  const directories = useDirectoryStore((state) => state.directories);
  const experiments = useExperimentStore((state) => state.experiments);

  const file = type === FileType.DIR ? directories[id] : experiments[id];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Rename: {file.name}</DialogTitle>
      <Box sx={{ px: 2 }}>
        <TextField
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label={file.name}
          type="text"
          fullWidth
          variant="outlined"
        />
      </Box>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleRename}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
