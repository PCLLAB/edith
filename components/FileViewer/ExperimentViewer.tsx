import { Paper } from "@mui/material";

import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";

type Props = {
  experimentId: string;
};
export const ExperimentViewer = ({ experimentId }: Props) => {
  const experiment = useExperimentStore(
    (state) => state.experiments[experimentId]
  );

  console.log("exp view", experiment);

  return <Paper>Experiment viewr</Paper>;
};
