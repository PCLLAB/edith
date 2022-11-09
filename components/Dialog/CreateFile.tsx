import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { createDirectory } from "../../lib/client/api/directories";
import { createExperiment } from "../../lib/client/api/experiments";
import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";
import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";
import { isRootId } from "../../lib/common/models/utils";
import { DirectoryFileType } from "../FileTree/FileSelectionProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  prefixPath: string;
  type: DirectoryFileType;
};

export const CreateFileDialog = ({
  open,
  type,
  onClose,
  prefixPath,
}: Props) => {
  const [fileName, setFileName] = useState("");

  const directories = useDirectoryStore((state) => state.directories);
  const experiments = useExperimentStore((state) => state.experiments);

  const { create, files, title } = useMemo(() => {
    switch (type) {
      case DirectoryFileType.DIR:
        return {
          create: createDirectory,
          files: directories,
          title: "Create new folder",
        };
      case DirectoryFileType.EXP:
        return {
          create: createExperiment,
          files: experiments,
          title: "Create new experiment",
        };
    }
  }, [directories, experiments, type]);

  const handleCreate = () => {
    create({ name: fileName, prefixPath });
    onClose();
  };

  const parentPath = prefixPath
    .split(",")
    .map((id) => (isRootId(id) ? "" : files[id].name))
    .join("/");

  const filePath = `${parentPath}/${fileName}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
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
