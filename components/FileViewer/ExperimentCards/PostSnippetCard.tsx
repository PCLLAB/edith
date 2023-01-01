import { Card, CardContent, Typography } from "@mui/material";
import { ExperimentJson } from "../../../lib/common/types/models";
import { CodeBlock } from "../../Code/Code";

type CardProps = {
  exp: ExperimentJson;
};

export const PostSnippetCard = ({ exp }: CardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          Experiment ID:
        </Typography>
        <CodeBlock>{exp._id}</CodeBlock>
        <Typography variant="h6" component="h2">
          Data endpoint
        </Typography>
        <CodeBlock>{`https://jarvis.psych.purdue.edu/api/v1/experiments/data/${exp._id}`}</CodeBlock>
        <Typography variant="h6" component="h2">
          Code snippet
        </Typography>
        <CodeBlock language="javascript">
          {`const data = jsPsych.data.getData();
fetch("https://jarvis.psych.purdue.edu/api/v1/experiments/data/${exp._id}", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})`}
        </CodeBlock>
      </CardContent>
    </Card>
  );
};
