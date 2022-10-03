import { useSWRConfig } from "swr";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateFileDialog = ({
  open,
  onClose,
  type,
}: Props & { type: "Directory" | "Experiment" }) => {
  const { mutate } = useSWRConfig();

  // {
  //   url: "/api/v2/directories/[id]/children" as const,
  //   method: "GET" as const,
  //   query: { id },
  // }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new {type}</DialogTitle>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label={`${type} Name`}
        type="text"
        fullWidth
        variant="outlined"
      />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export const CreateExperimentDialog = () => {};
