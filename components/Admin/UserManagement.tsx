import { useContext, useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Dialog, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import {
  DialogContext,
  useDialogContext,
} from "../../lib/client/context/DialogContext";
import { AdminDialog } from "../../pages/admin";
import { InviteUserDialog, DeleteUserDialog } from "../Dialog";

export const UserManagement = () => {
  const userMap = useBoundStore((state) => state.userMap);
  const getUsers = useBoundStore((state) => state.getUsers);

  const users = Object.values(userMap);

  const { openDialog, closeDialog } = useDialogContext<AdminDialog>();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Box sx={{ height: "100%" }} display="flex" flexDirection="column">
      <Typography variant="h4" component="h2">
        User Management
      </Typography>
      <Paper sx={{ flex: 1 }}>
        <DataGrid
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              onInvite: () => openDialog("Invite", { id: undefined }),
            },
          }}
          getRowId={(user) => user._id}
          rows={users}
          columns={[
            {
              field: "invite",
              type: "actions",
              flex: 2,
              // We make the quick and dirty assumption that users without names haven't completed setup.
              // This isn't worth checking the correct way and it works 100% of the time
              renderCell: (params) =>
                !params.row.name && (
                  <Button
                    onClick={() => openDialog("Invite", { id: params.row._id })}
                  >
                    View Invite
                  </Button>
                ),
            },
            { field: "name", headerName: "Name", flex: 4 },
            { field: "email", headerName: "Email", flex: 4 },
            {
              field: "superuser",
              headerName: "Role",
              type: "singleSelect",
              editable: true,
              renderCell: (params) => (params.value ? "Admin" : "User"),
              valueOptions: [
                { label: "Admin", value: true },
                { label: "User", value: false },
              ],
              flex: 1,
            },
            {
              field: "actions",
              type: "actions",
              flex: 1,
              getActions: (params) => [
                <GridActionsCellItem
                  nonce={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                  key={0}
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => {
                    console.log("delete", openDialog);
                    openDialog("Delete", { id: params.row._id });
                  }}
                />,
              ],
            },
          ]}
        />
      </Paper>
    </Box>
  );
};

type ToolbarProps = {
  onInvite: () => void;
};

const CustomToolbar = ({ onInvite }: ToolbarProps) => {
  return (
    <GridToolbarContainer>
      <Button
        onClick={onInvite}
        startIcon={<PersonAddIcon />}
        size="small"
        variant="contained"
      >
        Invite User
      </Button>
      <Box sx={{ flexGrow: 1, flexShrink: 1 }} />
      <GridToolbarQuickFilter sx={{ flexGrow: 1 }} />
    </GridToolbarContainer>
  );
};
