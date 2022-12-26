import { ChangeEvent, useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import {
  getExperimentMeta,
  updateExperiment,
} from "../../lib/client/api/experiments";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../lib/common/types/models";
import { CodeBlock } from "../Code/Code";
import { getLocalDayISO } from "../../lib/common/utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  experimentId: string;
  className?: string;
};

export const ExperimentViewer = ({ experimentId, className }: Props) => {
  const experiment = useBoundStore((state) => state.experiment[experimentId]);

  return (
    <Grid container spacing={2} m={1}>
      <Grid xs={12}>
        <h2>{experiment.name}</h2>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
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

const getMinusYear = (date: Date) => {
  const minus = new Date(date);
  minus.setFullYear(minus.getFullYear() - 1);
  minus.setDate(minus.getDate() + 1);
  return minus;
};

/** Return list of dates in inclusive range [start, end] */
const getDatesInRange = (start: Date, end: Date) => {
  console.log("EXPENSIVE CALCULATION IS RUNNING");
  const dates = [];
  for (; start <= end; start.setDate(start.getDate() + 1)) {
    dates.push(new Date(start));
  }
  return dates;
};

const CollectionDataCard = ({ exp }: CardProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const endDate =
    selectedYear == null ? new Date() : new Date(selectedYear, 11, 31);
  const startDate = getMinusYear(endDate);

  const expMeta = useBoundStore((store) => store.experimentMeta);

  const years = (() => {
    // return [2020, 2021, 2022];
    const years = [new Date().getFullYear()];

    const log = expMeta[exp._id]?.activityLog;
    if (log == null) return years;

    Object.keys(log).forEach((iso) => {
      const year = new Date(iso).getFullYear();
      if (years.includes(year)) return;
      years.push(year);
    }, []);

    return years;
  })();

  const values = useMemo(
    () =>
      getDatesInRange(new Date(startDate), endDate).map((date) => {
        const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDateKey = getLocalDayISO(date, localZone);
        const count = expMeta[exp._id]?.activityLog[localDateKey] ?? 0;
        return {
          date,
          count,
        };
      }),
    [startDate, endDate, exp._id, expMeta]
  );

  useEffect(() => {
    getExperimentMeta(exp._id);
  }, [exp._id]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          {expMeta[exp._id]?.mongoDBData.numDocuments} total data entries
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            columnGap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={values}
              titleForValue={(value) => {
                // This is called on values not included in values. Something to do with out of range days.
                if (!value) return;
                return `${
                  value.count
                } entries on ${value.date.toLocaleDateString()}`;
              }}
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
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {years.reverse().map((year) => (
              <Button
                key={year}
                variant={endDate.getFullYear() === year ? "contained" : "text"}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DownloadDataCard = ({ exp }: CardProps) => {
  return <Card></Card>;
};
