import { ChangeEvent, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

import { ExperimentJson } from "../../../lib/common/types/models";
import { useBoundStore } from "../../../lib/client/hooks/stores/useBoundStore";

type CardProps = {
  exp: ExperimentJson;
};

export const CollectionModeCard = ({ exp }: CardProps) => {
  const [loading, setLoading] = useState(false);

  const updateExperiment = useBoundStore((state) => state.updateExperiment);

  const onChange = (_: ChangeEvent, enabled: boolean) => {
    setLoading(true);
    updateExperiment(exp._id, { enabled }).then(() => setLoading(false));
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="h2">
            Data collection mode
          </Typography>
          <FormControlLabel
            control={<Switch checked={exp.enabled} onChange={onChange} />}
            label={
              loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography
                  variant="button"
                  fontWeight="bold"
                  color={exp.enabled ? "success.main" : "warning.main"}
                >
                  {exp.enabled ? "Live" : "Test"}
                </Typography>
              )
            }
            labelPlacement="start"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          In Test mode, any new experiment data will be saved without appearing
          as part of collected data. Test data can be viewed, deleted, or
          converted into collected data.
        </Typography>
      </CardContent>
    </Card>
  );
};
