import { FocusEvent, useState } from "react";

import { CircularProgress, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";
import { CodeBlock } from "../../../Code/Code";
import config from "../../../../lib/config";
import { CounterbalanceJson } from "../../../../lib/common/types/models";

type Props = {
  expId: string;
  cb?: CounterbalanceJson;
};
export const AssignLink = ({ expId, cb }: Props) => {
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
        onBlur={onBlur}
      />
      {cb && (
        <CodeBlock>{`${config.NEXT_PUBLIC_SITE_URL}/api/v2/assign/${cb.experiment}`}</CodeBlock>
      )}
    </Box>
  );
};
