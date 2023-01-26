import { Card, CardContent, Typography } from "@mui/material";
import { ExperimentJson } from "../../../lib/common/types/models";
import config from "../../../lib/config";
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
        <CodeBlock>{`${config.NEXT_PUBLIC_SITE_URL}/api/v2/experiments/${exp._id}/data`}</CodeBlock>
        <Typography variant="h6" component="h2">
          Code snippet
        </Typography>
        <CodeBlock language="javascript">
          {`const data = jsPsych.data.getData();
fetch("${config.NEXT_PUBLIC_SITE_URL}/api/v2/experiments/${exp._id}/data", {
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
