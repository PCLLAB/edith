import { useContext } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, IconButton, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid } from "@mui/x-data-grid";

import { ExpandedKeysContext } from "../../lib/client/context/ExpandedKeysProvider";
import {
  FileSelectionContext,
  FileType,
} from "../../lib/client/context/FileSelectionProvider";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { getAncestorsMinusRoot } from "../../lib/common/utils";
import { ExplorerDialog } from "../../pages/explorer";
import { useDialogContext } from "../../lib/client/context/DialogContext";

type Props = {
  directoryId: string;
};

export const DirectoryViewer = ({ directoryId }: Props) => {
  const directoryMap = useBoundStore((state) => state.directoryMap);
  const directory = directoryMap[directoryId];

  const experimentMap = useBoundStore((state) => state.experimentMap);

  const { setExpandedKeys } = useContext(ExpandedKeysContext);
  const { setFileSelection } = useContext(FileSelectionContext);

  const childrenExps = Object.values(experimentMap)
    .filter((exp) => exp.directory === directoryId)
    .map((exp) => ({
      id: exp._id,
      name: exp.name,
      updatedAt: new Date(exp.updatedAt),
    }));

  const { openDialog } = useDialogContext<ExplorerDialog>();

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Grid container spacing={2}>
        <Grid
          xs={12}
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          <Typography variant="h4" component="h2">
            {directory.name}
          </Typography>
          <Card sx={{ ml: "auto" }}>
            <IconButton
              onClick={() =>
                openDialog("RENAME", {
                  fileType: FileType.DIR,
                  id: directoryId,
                })
              }
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                openDialog("DELETE", {
                  fileType: FileType.DIR,
                  id: directoryId,
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        </Grid>
      </Grid>
      <Paper sx={{ flex: 1 }}>
        <DataGrid
          columns={[
            { field: "name", headerName: "Experiment", flex: 2 },
            {
              field: "updatedAt",
              type: "dateTime",
              headerName: "Last Updated",
              flex: 1,
            },
          ]}
          rows={childrenExps}
          onRowClick={(row) => {
            setFileSelection({
              id: row.id as string,
              type: FileType.EXP,
            });

            setExpandedKeys((prev) => {
              const toAdd = [
                directoryId,
                ...getAncestorsMinusRoot(directory),
              ].filter((id) => !prev.includes(id));
              return [...prev, ...toAdd];
            });
          }}
        />
      </Paper>
    </Box>
  );
};
