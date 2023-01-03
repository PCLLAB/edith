import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect } from "react";

import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import {
  CollectionModeCard,
  DataDownloadCard,
  CollectionDataCard,
  PostSnippetCard,
  CounterbalanceCard,
} from "./ExperimentCards";

type Props = {
  experimentId: string;
  className?: string;
};

export const ExperimentViewer = ({ experimentId, className }: Props) => {
  const experiment = useBoundStore(
    (state) => state.experimentMap[experimentId]
  );

  const getExperimentMeta = useBoundStore((state) => state.getExperimentMeta);
  const getCounterbalance = useBoundStore((state) => state.getCounterbalance);

  useEffect(() => {
    console.log("running exp view fetches");
    getExperimentMeta(experimentId);
    getCounterbalance(experimentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  return (
    <Grid container spacing={2} m={1}>
      <Grid xs={12}>
        <h2>{experiment.name}</h2>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
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
