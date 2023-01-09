import { Dialog } from "@mui/material";
import { Context, createContext, ReactNode, useContext, useState } from "react";
import { InviteUserDialog, DeleteUserDialog } from "../../../components/Dialog";

type BaseDialog = {
  type: string;
};

type DialogContextValue<T extends BaseDialog> = {
  closeDialog: () => void;
  openDialog: (dialog: T) => void;
  dialog: T | null;
};

export const DialogContext = createContext<DialogContextValue<BaseDialog>>({
  closeDialog: () => {},
  openDialog: () => {},
  dialog: null,
});

type Props = {
  children: ReactNode;
};

export const DialogContextProvider = <T extends BaseDialog>({
  children,
}: Props) => {
  const [dialog, setDialog] = useState<T | null>(null);
  const closeDialog = () => setDialog(null);

  // const t = React.createElement()

  return (
    <DialogContext.Provider
      value={{
        closeDialog,
        // @ts-ignore shut up ts
        openDialog: setDialog,
        dialog,
      }}
    >
      {children}

      {/* <Dialog open={!!dialog} fullWidth maxWidth="sm" onClose={closeDialog}>
        </Dialog> */}
    </DialogContext.Provider>
  );
};

export const useDialogContext = <T extends BaseDialog>() => {
  const context = useContext<DialogContextValue<T>>(
    DialogContext as unknown as Context<DialogContextValue<T>>
  );

  return context;
};
