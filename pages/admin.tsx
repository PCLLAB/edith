import { useContext } from "react";

import { UserManagement } from "../components/Admin/UserManagement";
import { DeleteUserDialog, InviteUserDialog } from "../components/Dialog";
import { SiteWideAppBar } from "../components/SiteWideAppBar";
import { AuthContext } from "../lib/client/context/AuthProvider";
import {
  CreateDialogType,
  DialogContextProvider,
} from "../lib/client/context/DialogContext";

import type { NextPage } from "next";

export type AdminDialog = CreateDialogType<typeof AdminRenderMap>;

const AdminRenderMap = {
  Invite: InviteUserDialog,
  Delete: DeleteUserDialog,
};

const Admin: NextPage = () => {
  const { user } = useContext(AuthContext);

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
      <DialogContextProvider<AdminDialog> rendererMap={AdminRenderMap}>
        <SiteWideAppBar />
        <UserManagement />
      </DialogContextProvider>
    </>
  );
};

export default Admin;
