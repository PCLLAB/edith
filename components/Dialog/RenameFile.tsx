import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  type: FileType;
};

export const RenameFileDialog = ({ type, onClose, id }: Props) => {
  const updateFile = useBoundStore((state) => {
    switch (type) {
      case FileType.DIR:
        return state.updateDirectory;
      case FileType.EXP:
        return state.updateExperiment;
    }
  });

  const handleRename = () => {
    updateFile(id, { name: fileName });
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

  const [fileName, setFileName] = useState(file.name);

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>
        Rename {DialogInfo[type].title}
      </DialogTitleWithClose>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRename}>Rename</Button>
      </DialogActions>
    </>
  );
};
