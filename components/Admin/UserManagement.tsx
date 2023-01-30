import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Paper, Typography } from "@mui/material";
import { Box, SxProps } from "@mui/system";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellModes,
  GridCellModesModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { useDialogContext } from "../../lib/client/context/DialogContext";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { AdminDialog } from "../../pages/admin";

type Props = {
  sx?: SxProps;
};

export const UserManagement = ({ sx }: Props) => {
  const userMap = useBoundStore((state) => state.userMap);
  const getUsers = useBoundStore((state) => state.getUsers);
  const updateUser = useBoundStore((state) => state.updateUser);

  const users = Object.values(userMap);

  const { openDialog } = useDialogContext<AdminDialog>();

  useEffect(() => {
    getUsers();
  }, []);

  const [model, setModel] = useState<GridCellModesModel>({});

  return (
    <Box sx={sx} display="flex" flexDirection="column" height="100%" gap={2}>
      <Typography variant="h4" component="h2">
        User Management
      </Typography>
      <Paper sx={{ flex: 1 }}>
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              onInvite: () => openDialog("Invite", { id: undefined }),
            },
          }}
          getRowId={(user) => user._id}
          processRowUpdate={async (newRow, oldRow) => {
            if (newRow.superuser === oldRow.superuser) return newRow;
            console.log(newRow);

            try {
              const user = await updateUser(newRow._id, {
                superuser: newRow.superuser,
              });
              return user;
            } catch {
              throw newRow._id;
            }
          }}
          onProcessRowUpdateError={(id) => {
            setModel((model) => ({
              ...model,
              [id]: {
                superuser: {
                  mode: GridCellModes.View,
                  ignoreModifications: true,
                },
              },
            }));
          }}
          cellModesModel={model}
          onCellModesModelChange={(cellModesModel) => {
            setModel(cellModesModel);
          }}
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
              flex: 2,
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
