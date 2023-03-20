import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
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
  fileType: FileType;
};

export const CreateFileDialog = ({ fileType, onClose, prefixPath }: Props) => {
  const [fileName, setFileName] = useState("");

  const createFile = useBoundStore((state) => {
    switch (fileType) {
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
        Create {DialogInfo[fileType].title}
      </DialogTitleWithClose>
      <DialogContent>
        {/* This tomfoolery b/c DialogContent has inline styles which cover TextField label  */}
        <Box sx={{ pt: 2 }} />
        <TextField
          inputRef={inputRef}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          autoFocus
          id="name"
          label={filePath}
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </>
  );
};
