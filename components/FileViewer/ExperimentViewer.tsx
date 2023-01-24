import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Card, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect } from "react";
import { useDialogContext } from "../../lib/client/context/DialogContext";
import { FileType } from "../../lib/client/context/FileSelectionProvider";

import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { ExplorerDialog } from "../../pages/explorer";
import {
  CollectionModeCard,
  DataDownloadCard,
  CollectionDataCard,
  PostSnippetCard,
  CounterbalanceCard,
} from "./ExperimentCards";

type Props = {
  experimentId: string;
};

export const ExperimentViewer = ({ experimentId }: Props) => {
  const experiment = useBoundStore(
    (state) => state.experimentMap[experimentId]
  );

  const getExperimentMeta = useBoundStore((state) => state.getExperimentMeta);
  const getCounterbalance = useBoundStore((state) => state.getCounterbalance);

  const { openDialog } = useDialogContext<ExplorerDialog>();

  useEffect(() => {
    console.log("running exp view fetches");
    getExperimentMeta(experimentId);
    getCounterbalance(experimentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  return (
    // Extra bottom padding is needed b/c browsers delete end padding when overflow scroll
    <Grid container spacing={2} pb={6}>
      <Grid
        xs={12}
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
      >
        <Typography variant="h4" component="h2">
          {experiment.name}
        </Typography>
        <Card sx={{ ml: "auto" }}>
          <IconButton
            onClick={() =>
              openDialog("RENAME", { fileType: FileType.EXP, id: experimentId })
            }
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              openDialog("DELETE", { fileType: FileType.EXP, id: experimentId })
            }
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      </Grid>
      <Grid xs={12} md={4}>
        <CollectionModeCard exp={experiment} />
      </Grid>
      <Grid xs={12} md={8}>
        <DataDownloadCard exp={experiment} />
      </Grid>
      <Grid xs={12}>
        <CollectionDataCard exp={experiment} />
      </Grid>
      <Grid xs={12}>
        <PostSnippetCard exp={experiment} />
      </Grid>
      <Grid xs={12}>
        <CounterbalanceCard exp={experiment} />
      </Grid>
    </Grid>
  );
};
