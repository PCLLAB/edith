import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import {
  deleteDirectory,
  updateDirectory,
} from "../../lib/client/api/directories";
import {
  deleteExperiment,
  updateExperiment,
} from "../../lib/client/api/experiments";
import { FileType } from "../../lib/client/context/FileSelectionProvider";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";

const DialogInfo = {
  [FileType.DIR]: { delete: deleteDirectory, title: "directory" },
  [FileType.EXP]: { delete: deleteExperiment, title: "experiment" },
};

type Props = {
  id: string;
  onClose: () => void;
  type: FileType;
};

export const DeleteFileDialog = ({ type, onClose, id }: Props) => {
  const handleDelete = () => {
    DialogInfo[type].delete(id);
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

  const [fileName, setFileName] = useState("");

  return (
    <>
      <DialogTitle>Delete {DialogInfo[type].title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Type <b>{file.name}</b> to confirm.
        </DialogContentText>
        <TextField
          inputRef={inputRef}
          value={fileName}
          error={!file.name.startsWith(fileName)}
          onChange={(e) => setFileName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          type="text"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} disabled={fileName != file.name}>
          Delete
        </Button>
      </DialogActions>
    </>
  );
};
