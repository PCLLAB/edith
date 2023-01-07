import { useEffect, useRef, useState } from "react";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";

import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

type Props = {
  id: string;
  onClose: () => void;
};

export const DeleteUserDialog = ({ onClose, id }: Props) => {
  const deleteUser = useBoundStore((state) => state.deleteUser);

  const handleDelete = () => {
    deleteUser(id);
    onClose();
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const user = useBoundStore((state) => state.userMap[id]);

  const [userEmail, setUserEmail] = useState("");

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>Delete user</DialogTitleWithClose>
      <DialogContent>
        <DialogContentText>
          Type <b>{user.email}</b> to confirm.
        </DialogContentText>
        <TextField
          inputRef={inputRef}
          value={userEmail}
          error={!user.email.startsWith(userEmail)}
          onChange={(e) => setUserEmail(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          type="text"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} disabled={userEmail != user.email}>
          Delete
        </Button>
      </DialogActions>
    </>
  );
};
