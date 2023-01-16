import { FocusEvent, useState } from "react";

import { CircularProgress, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";
import { CodeBlock } from "../../../Code/Code";
import config from "../../../../lib/config";

type Props = {
  expId: string;
};
export const AssignLink = ({ expId }: Props) => {
  const cb = useBoundStore((state) => state.counterbalanceMap[expId]);

  const updateCounterbalance = useBoundStore(
    (state) => state.updateCounterbalance
  );
  const createCounterbalance = useBoundStore(
    (state) => state.createCounterbalance
  );

  const [loading, setLoading] = useState(false);

  const onBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const url = event.target.value;

    if (url === "") return;
    if (url === cb?.url) return;

    setLoading(true);

    if (cb || loading) {
      await updateCounterbalance(expId, { url });
    } else {
      await createCounterbalance({ experiment: expId, url });
    }

    setLoading(false);
  };
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Typography variant="h6" component="h2">
          Counterbalance
        </Typography>
        {loading && (
          <Box marginLeft="auto" display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="warning.light">
              *Saving url
            </Typography>
            <CircularProgress size={16} />
          </Box>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary">
        The assignment URL will redirect to the base experiment URL with
        automatically assigned parameters.
      </Typography>
      <TextField
        label="Base experiment link"
        required
        fullWidth
        margin="normal"
        defaultValue={cb?.url}
        // Use key to force rerender, b/c defaultValue isn't set when expId/cb changes
        key={cb?.url}
        onBlur={onBlur}
      />
      {cb && (
        <CodeBlock>{`${config.NEXT_PUBLIC_SITE_URL}/api/v2/assign/${cb.experiment}`}</CodeBlock>
      )}
    </Box>
  );
};
