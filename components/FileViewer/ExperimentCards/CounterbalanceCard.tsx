import { Card, CardContent, Typography, TextField } from "@mui/material";
import { ExperimentJson } from "../../../lib/common/types/models";
import { CodeBlock } from "../../Code/Code";

type CardProps = {
  exp: ExperimentJson;
};
export const CounterbalanceCard = ({ exp }: CardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          Condition assign link
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This will redirect to the base experiment link with
          conditions/parameters applied.
        </Typography>
        <CodeBlock>
          {`https://jarvis.psych.purdue.edu/api/v1/experiments/assign/${exp._id}`}
        </CodeBlock>
        <Typography variant="h6" component="h2">
          Base experiment link
        </Typography>
        <TextField label="Base experiment link" required fullWidth />
      </CardContent>
    </Card>
  );
};

const ParameterSetting = () => {};
