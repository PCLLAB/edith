import { Paper } from "@mui/material";

import { useExperimentById } from "../../lib/client/hooks/api/experiments";

type Props = {
  experimentId: string;
};
export const ExperimentViewer = ({ experimentId }: Props) => {
  const { experiment, loading, error } = useExperimentById(experimentId);
  return <Paper>Experiment viewr</Paper>;
};
