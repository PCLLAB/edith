import { useForm } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
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

import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../../../lib/common/types/models";
import config from "../../../../lib/config";
import { CodeBlock } from "../../../Code/Code";
import { ParamOptions } from "./ParamOptions";

type CardProps = {
  exp: ExperimentJson;
};
export const CounterbalanceCard = ({ exp }: CardProps) => {
  const cb = useBoundStore((state) => state.counterbalanceMap[exp._id]) ?? {
    url: "",
  };

  const { control, register, watch } = useForm({
    defaultValues: {
      url: cb.url,
    },
  });

  console.log(watch());

  // const {
  //   fields: quotaFields,
  //   append: quotaAppend,
  //   remove: quotaRemove,
  // } = useFieldArray({
  //   name: "quotas",
  //   control,
  // });

  return (
    <Card>
      <CardContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <Box>
          <Typography variant="h6" component="h2">
            Counterbalance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The assignment URL will redirect to the base experiment URL with
            automatically assigned parameters.
          </Typography>
          <TextField
            label="Base experiment link"
            required
            fullWidth
            margin="normal"
          />
          <CodeBlock>{`${config.NEXT_PUBLIC_SITE_URL}/api/v2/assign/${cb.experiment}`}</CodeBlock>
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
