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
import { getIdFromPath } from "../../lib/common/utils";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

const DialogInfo = {
  [FileType.DIR]: { title: "directory" },
  [FileType.EXP]: { title: "experiment" },
};

type Props = {
  onClose: () => void;
  prefixPath: string;
  type: FileType;
};

export const CreateFileDialog = ({ type, onClose, prefixPath }: Props) => {
  const [fileName, setFileName] = useState("");

  const createFile = useBoundStore((state) => {
    switch (type) {
      case FileType.DIR:
        return state.createDirectory;
      case FileType.EXP:
        return state.createExperiment;
    }
  });

  const directories = useBoundStore((state) => state.directoryMap);

  const handleCreate = () => {
    createFile({
      name: fileName,
      directory: getIdFromPath(prefixPath),
      prefixPath,
    });
    onClose();
  };

  const parentPath = prefixPath
    .split(",")
    .map((id) => directories[id].name)
    .join("/");

  const filePath = `${parentPath}/${fileName}`;

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>
        Create {DialogInfo[type].title}
      </DialogTitleWithClose>
      <DialogContent sx={{ px: 2 }}>
        <TextField
          inputRef={inputRef}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label={filePath}
          type="text"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </>
  );
};
