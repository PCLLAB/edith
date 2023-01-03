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

import { FileType } from "../../lib/client/context/FileSelectionProvider";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

const DialogInfo = {
  [FileType.DIR]: { title: "directory" },
  [FileType.EXP]: { title: "experiment" },
};

type Props = {
  id: string;
  onClose: () => void;
  type: FileType;
};

export const DeleteFileDialog = ({ type, onClose, id }: Props) => {
  const deleteFile = useBoundStore((state) => {
    switch (type) {
      case FileType.DIR:
        return state.deleteDirectory;
      case FileType.EXP:
        return state.deleteExperiment;
    }
  });
  const handleDelete = () => {
    deleteFile(id);
    onClose();
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const directories = useBoundStore((state) => state.directoryMap);
  const experiments = useBoundStore((state) => state.experimentMap);
  const file = type === FileType.DIR ? directories[id] : experiments[id];

  const [fileName, setFileName] = useState("");

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>
        Delete {DialogInfo[type].title}
      </DialogTitleWithClose>
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
        <Button onClick={handleDelete} disabled={fileName != file.name}>
          Delete
        </Button>
      </DialogActions>
    </>
  );
};
