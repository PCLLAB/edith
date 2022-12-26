import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";

import { updateDirectory } from "../../lib/client/api/directories";
import { updateExperiment } from "../../lib/client/api/experiments";
import { FileType } from "../../lib/client/context/FileSelectionProvider";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";

const DialogInfo = {
  [FileType.DIR]: { update: updateDirectory, title: "directory" },
  [FileType.EXP]: { update: updateExperiment, title: "experiment" },
};

type Props = {
  id: string;
  onClose: () => void;
  type: FileType;
};

export const RenameFileDialog = ({ type, onClose, id }: Props) => {
  const handleClose = () => {
    onClose();
  };

  const handleRename = () => {
    DialogInfo[type].update(id, { name: fileName });
    onClose();
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const directories = useBoundStore((state) => state.directory);
  const experiments = useBoundStore((state) => state.experiment);
  const file = type === FileType.DIR ? directories[id] : experiments[id];

  const [fileName, setFileName] = useState(file.name);

  return (
    <>
      <DialogTitle>Rename {DialogInfo[type].title}</DialogTitle>
      <Box sx={{ px: 2 }}>
        <TextField
          inputRef={inputRef}
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
        <Button onClick={handleRename}>Rename</Button>
      </DialogActions>
    </>
  );
};
