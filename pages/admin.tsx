import { useContext, useEffect } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { AuthContext } from "../lib/client/context/AuthProvider";
import { useBoundStore } from "../lib/client/hooks/stores/useBoundStore";

import type { NextPage } from "next";
const Admin: NextPage = () => {
  const { user } = useContext(AuthContext);

  const userMap = useBoundStore((state) => state.userMap);
  const getUsers = useBoundStore((state) => state.getUsers);

  const users = Object.values(userMap);

  useEffect(() => {
    getUsers();
  }, []);

  if (!user?.superuser) {
    return (
      <div>
        You are not authorized to view this page. If you believe this is an
        error, contact someone?
      </div>
    );
  }

  return (
    <Box sx={{ height: "100%" }} display="flex" flexDirection="column">
      <Typography variant="h4" component="h2">
        User Management
      </Typography>
      <Paper sx={{ flex: 1 }}>
        <DataGrid
          components={{ Toolbar: CustomToolbar }}
          getRowId={(user) => user._id}
          rows={users}
          columns={[
            { field: "name", headerName: "Name", flex: 2 },
            { field: "email", headerName: "Email", flex: 1 },
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
                    console.log("delete", params.id);
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
const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      {/* <GridToolbarExport /> */}
      <Button startIcon={<PersonAddIcon />} size="small" variant="contained">
        Invite User
      </Button>
      <Box sx={{ flexGrow: 1, flexShrink: 1 }} />
      <GridToolbarQuickFilter sx={{ flexGrow: 1 }} />
    </GridToolbarContainer>
  );
};

export default Admin;
