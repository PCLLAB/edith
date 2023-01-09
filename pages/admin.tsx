import { useContext } from "react";

import { Dialog } from "@mui/material";

import { UserManagement } from "../components/Admin/UserManagement";
import { DeleteUserDialog, InviteUserDialog } from "../components/Dialog";
import { AuthContext } from "../lib/client/context/AuthProvider";
import {
  DialogContextProvider,
  useDialogContext,
} from "../lib/client/context/DialogContext";

import type { NextPage } from "next";
export type AdminDialog =
  | {
      type: "Invite";
      data?: string;
    }
  | {
      type: "Delete";
      data?: string;
    };

const Admin: NextPage = () => {
  const { user } = useContext(AuthContext);

  const { dialog, closeDialog } = useDialogContext<AdminDialog>();

  if (!user?.superuser) {
    return (
      <div>
        You are not authorized to view this page. If you believe this is an
        error, contact someone?
      </div>
    );
  }

  return (
    <>
      {/* Pass in all dialogs as prop, then spread dialog as props  */}
      <DialogContextProvider>
        <UserManagement />
        <Dialog open={!!dialog} fullWidth maxWidth="sm" onClose={closeDialog}>
          {dialog?.type === "Invite" && (
            <InviteUserDialog onClose={closeDialog} id={dialog?.data} />
          )}
          {dialog?.type === "Delete" && (
            <DeleteUserDialog onClose={closeDialog} id={dialog.data!} />
          )}
        </Dialog>
      </DialogContextProvider>
    </>
  );
};

export default Admin;
