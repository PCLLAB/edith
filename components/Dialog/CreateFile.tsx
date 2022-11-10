import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";

import { createDirectory } from "../../lib/client/api/directories";
import { createExperiment } from "../../lib/client/api/experiments";
import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";
import { isRootId } from "../../lib/common/models/utils";
import { FileType } from "../FileTree/FileSelectionProvider";

const DialogInfo = {
  [FileType.DIR]: { create: createDirectory, title: "Directory" },
  [FileType.EXP]: { create: createExperiment, title: "Experiment" },
};

type Props = {
  open: boolean;
  onClose: () => void;
  prefixPath: string;
  type: FileType;
};

export const CreateFileDialog = ({
  open,
  type,
  onClose,
  prefixPath,
}: Props) => {
  const [fileName, setFileName] = useState("");

  const directories = useDirectoryStore((state) => state.directories);

  const handleCreate = () => {
    DialogInfo[type].create({ name: fileName, prefixPath });
    onClose();
  };

  const parentPath = prefixPath
    .split(",")
    .map((id) => (isRootId(id) ? "" : directories[id].name))
    .join("/");

  const filePath = `${parentPath}/${fileName}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create {DialogInfo[type].title}</DialogTitle>
      <Box sx={{ px: 2 }}>
        <TextField
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
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
