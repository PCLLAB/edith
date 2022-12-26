import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControlLabel,
  Paper,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CalendarHeatmap from "react-calendar-heatmap";
import { useExperimentStore } from "../../lib/client/hooks/stores/useExperimentStore";
import { ExperimentJson } from "../../lib/common/models/types";
import { updateExperiment } from "../../lib/client/api/experiments";
import { ChangeEvent, useEffect, useState } from "react";
import { CodeBlock, CodeInline } from "../Code/Code";

type Props = {
  experimentId: string;
  className?: string;
};

export const ExperimentViewer = ({ experimentId, className }: Props) => {
  const experiment = useExperimentStore(
    (state) => state.experiments[experimentId]
  );

  return (
    <Grid container spacing={2} m={1}>
      <Grid xs={12}>
        <h2>{experiment.name}</h2>
      </Grid>
      <Grid xs={12} md={6}>
        <CollectionModeCard exp={experiment} />
      </Grid>
      <Grid xs={12} md={6}>
        <PostSnippetCard exp={experiment} />
      </Grid>
      <Grid xs={12}>
        <CollectionDataCard exp={experiment} />
      </Grid>
    </Grid>
  );
};

type CardProps = {
  exp: ExperimentJson;
};

const CollectionModeCard = ({ exp }: CardProps) => {
  const [loading, setLoading] = useState(false);

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
          In Test mode, any new experiment data will be cached instead of
          collected. Cached data can be viewed, deleted, or converted into
          collected data.
        </Typography>
      </CardContent>
    </Card>
  );
};

const PostSnippetCard = ({ exp }: CardProps) => {
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

const getDateOneYearAgoPlusOne = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  date.setDate(date.getDate() + 1);
  return date;
};

/** Return list of dates in inclusive range [start, end] */
const getDatesInRange = (start: Date, end: Date) => {
  console.log("GOT DATES");
  const dates = [];
  for (; start <= end; start.setDate(start.getDate() + 1)) {
    dates.push(new Date(start));
  }
  return dates;
};

const CollectionDataCard = ({ exp }: CardProps) => {
  const [startDate, setStartDate] = useState(getDateOneYearAgoPlusOne());
  const [endDate, setEndDate] = useState(new Date());

  const values = getDatesInRange(new Date(startDate), endDate).map((date) => ({
    date,
    count: Math.floor(Math.random() * 10),
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          Experiment Activity
        </Typography>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          titleForValue={(value) =>
            value ? value.date.toISOString() : "fucked up"
          }
          showWeekdayLabels
          classForValue={(value) => {
            // see lib/client/calendar-heatmap.css
            if (!value || !value.count) {
              return "color-0";
            }
            if (value.count < 2) {
              return "color-1";
            }
            if (value.count < 4) {
              return "color-2";
            }
            if (value.count < 8) {
              return "color-3";
            }
            return "color-4";
          }}
          // showOutOfRangeDays
          // horizontal={false}
        />
      </CardContent>
    </Card>
  );
};
