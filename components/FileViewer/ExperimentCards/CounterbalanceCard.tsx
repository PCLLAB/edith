import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";

import { useBoundStore } from "../../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../../lib/common/types/models";

type CardProps = {
  exp: ExperimentJson;
};
export const CounterbalanceCard = ({ exp }: CardProps) => {
  const cb = useBoundStore((state) => state.counterbalanceMap[exp._id]);
  console.log("counterbalance", cb);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          Counterbalance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          this is text
        </Typography>
        <TextField label="Base experiment link" required fullWidth />
        <Box display="flex" flexWrap="wrap" gap={3}>
          <ParameterSetting />
          <ParameterSetting />
          <ParameterSetting />
          <Box sx={{ flex: 1, minWidth: 200, mt: 2 }}>
            <Button variant="outlined" fullWidth startIcon={<LibraryAddIcon />}>
              Add parameter
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
const ParameterSetting = () => {
  const key = "test";

  const values = Array(Math.floor(Math.random() * 4)).fill(0);

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
      {values.map((v, i) => (
        <ListItem
          key={v}
          secondaryAction={
            <IconButton edge="end" aria-label="remove">
              {/* Don't show remove button if only one  */}
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
      ))}
      <ListItem secondaryAction={<IconButton edge="end" />}>
        <Button variant="contained" fullWidth>
          Add option
        </Button>
      </ListItem>
    </List>
  );
};
