import { useEffect, useRef, useState } from "react";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
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
  fileType: FileType;
};

export const DeleteFileDialog = ({ fileType, onClose, id }: Props) => {
  const deleteFile = useBoundStore((state) => {
    switch (fileType) {
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

  const dirMap = useBoundStore((state) => state.directoryMap);
  const expMap = useBoundStore((state) => state.experimentMap);

  const file = fileType === FileType.DIR ? dirMap[id] : expMap[id];

  const [fileName, setFileName] = useState("");

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>
        Delete {DialogInfo[fileType].title}
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
          id="name"
          type="text"
          fullWidth
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
