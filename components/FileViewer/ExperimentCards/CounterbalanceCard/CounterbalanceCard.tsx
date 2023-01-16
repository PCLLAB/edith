import { FocusEvent, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";

import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../../../lib/common/types/models";
import config from "../../../../lib/config";
import { CodeBlock } from "../../../Code/Code";
import { ParamOptions } from "./ParamOptions";

type CardProps = {
  exp: ExperimentJson;
};
export const CounterbalanceCard = ({ exp }: CardProps) => {
  const cb = useBoundStore((state) => state.counterbalanceMap[exp._id]);
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
      await updateCounterbalance(exp._id, { url });
    } else {
      await createCounterbalance({ experiment: exp._id, url });
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
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
        <ParamOptions expId={exp._id} />
        <Typography variant="h6" component="h2">
          Parameter Quotas
        </Typography>
      </CardContent>
    </Card>
  );
};

const QuotaSetting = () => {
  return (
    <List sx={{ flex: 1, minWidth: 200 }}>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }
        sx={{ pl: 0 }}
      >
        <TextField label="Parameter Name" required fullWidth size="small" />
      </ListItem>
      {/* {values.map((v, i) => (
        <ListItem
          key={v}
          secondaryAction={
            <IconButton edge="end" aria-label="remove">
              {values.length === 1 ? null : <RemoveIcon />}
            </IconButton>
          }
        >
          <TextField
            label={`Option ${i + 1}`}
            required
            fullWidth
            size="small"
          />
        </ListItem>
      ))} */}
      <ListItem secondaryAction={<IconButton edge="end" />}>
        <Button variant="contained" fullWidth>
          Add option
        </Button>
      </ListItem>
    </List>
  );
};
