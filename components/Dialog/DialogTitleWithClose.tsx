import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  onClose: () => void;
  children: ReactNode;
};
export const DialogTitleWithClose = ({ onClose, children }: Props) => {
  return (
    <DialogTitle>
      {children}
      {
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      }
    </DialogTitle>
  );
};
