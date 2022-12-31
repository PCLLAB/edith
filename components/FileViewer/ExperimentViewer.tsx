import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  FormControlLabel,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";

import { updateExperiment } from "../../lib/client/api/experiments";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../lib/common/types/models";
import { getLocalDayISO } from "../../lib/common/utils";
import { CodeBlock } from "../Code/Code";
import { DataGridDialog } from "../Dialog/DataGrid";

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
      <Grid xs={12} md={4}>
        <CollectionModeCard exp={experiment} />
      </Grid>
      <Grid xs={12} md={8}>
        <DataDownloadCard exp={experiment} />
      </Grid>
      <Grid xs={12}>
        <CollectionDataCard exp={experiment} />
      </Grid>
      <Grid xs={12} md={6}>
        <PostSnippetCard exp={experiment} />
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
          In Test mode, any new experiment data will be saved but not collected.
          Test data can be viewed, deleted, or converted into collected data.
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
  console.log("CC card render");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const endDate =
    selectedYear == null ? new Date() : new Date(selectedYear, 11, 31);
  const startDate = getMinusYear(endDate);

  const getExperimentMeta = useBoundStore((store) => store.getExperimentMeta);

  const expMeta = getExperimentMeta(exp._id);
  console.log("expmeta in cc card", expMeta);

  const years = (() => {
    // return [2020, 2021, 2022];
    const years = [new Date().getFullYear()];

    const log = expMeta?.activityLog;
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
        const count = expMeta?.activityLog[localDateKey] ?? 0;
        return {
          date,
          count,
        };
      }),
    [startDate, endDate, expMeta]
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          {expMeta?.mongoDBData.numDocuments} total data entries
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

const DownloadOptions = [
  {
    name: "Download as CSV",
  },
  {
    name: "Download as JSON",
  },
];

const DataDownloadCard = ({ exp }: CardProps) => {
  console.log("DD card render");
  const [dropOpen, setDropOpen] = useState(false);
  const onToggleDrop = () => setDropOpen((prev) => !prev);

  const [dialogOpen, setDialogOpen] = useState(false);
  const onToggleDialog = () => setDialogOpen((prev) => !prev);

  const anchorRef = useRef(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2022-04-07"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const getExperimentMeta = useBoundStore((state) => state.getExperimentMeta);
  const expMeta = getExperimentMeta(exp._id);

  console.log("expmeta in DD", expMeta);

  const activityLog = expMeta?.activityLog ?? {};

  const numEntries = Object.keys(activityLog).length;

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2">
            Collected Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select entries within range (inclusive).
          </Typography>
          <Box display="flex" flexWrap="wrap" sx={{ gap: 2, mt: 2 }}>
            <TextField label="First" defaultValue={Math.min(1, numEntries)} />
            <TextField
              label="Last"
              defaultValue={numEntries}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Select data between start and end (inclusive).
          </Typography>
          <Box display="flex" flexWrap="wrap" sx={{ gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(props) => <TextField {...props} />}
              />
              <DateTimePicker
                label="End"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(props) => <TextField {...props} />}
              />
            </LocalizationProvider>
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <Button onClick={onToggleDialog} variant="contained">
            View data
          </Button>
          <ButtonGroup
            variant="outlined"
            ref={anchorRef}
            sx={{ ml: 1, flex: "right" }}
          >
            <Button>Download as CSV</Button>
            <Button size="small" onClick={onToggleDrop}>
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={dropOpen}
            disablePortal
            anchorEl={anchorRef.current}
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <Paper>
              <ClickAwayListener onClickAway={onToggleDrop}>
                <MenuList autoFocusItem>
                  <MenuItem>test</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </CardActions>
      </Card>
      <Dialog
        open={dialogOpen}
        maxWidth="xl"
        fullWidth
        onClose={onToggleDialog}
      >
        <DataGridDialog onClose={onToggleDialog} />
      </Dialog>
    </>
  );
};
