import { useContext } from "react";

import { UserManagement } from "../components/Admin/UserManagement";
import { DeleteUserDialog, InviteUserDialog } from "../components/Dialog";
import { SiteWideAppBar } from "../components/SiteWideAppBar";
import { AuthContext } from "../lib/client/context/AuthProvider";
import {
  DialogType,
  DialogContextProvider,
} from "../lib/client/context/DialogContext";
import PeopleIcon from "@mui/icons-material/People";
import type { NextPage } from "next";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

export type AdminDialog = DialogType<typeof AdminDialogRenderMap>;

const AdminDialogRenderMap = {
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
      <DialogContextProvider rendererMap={AdminDialogRenderMap}>
        <SiteWideAppBar />
        <Box display="flex" height="100%">
          <Paper elevation={0} sx={{ flexBasis: 320 }}>
            <List>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItemButton>
            </List>
          </Paper>
          <UserManagement sx={{ flex: 1, p: 3 }} />
        </Box>
      </DialogContextProvider>
    </>
  );
};

export default Admin;
