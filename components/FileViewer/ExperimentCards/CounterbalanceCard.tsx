import { Card, CardContent, Typography, TextField } from "@mui/material";
import { useBoundStore } from "../../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../../lib/common/types/models";
import { CodeBlock } from "../../Code/Code";

type CardProps = {
  exp: ExperimentJson;
};
export const CounterbalanceCard = ({ exp }: CardProps) => {
  const cb = useBoundStore((state) => state.getCounterbalance(exp._id));
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
      </CardContent>
    </Card>
  );
};

const ParameterSetting = () => {};
