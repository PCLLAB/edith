import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useDialogContext } from "../../../lib/client/context/DialogContext";
import { useBoundStore } from "../../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../../lib/common/types/models";
import { ExplorerDialog } from "../../../pages/explorer";

type CardProps = {
  exp: ExperimentJson;
};

const DownloadOptions = [
  {
    name: "Download as CSV",
  },
  {
    name: "Download as JSON",
  },
];

export const DataDownloadCard = ({ exp }: CardProps) => {
  console.log("DD card render");
  const [dropOpen, setDropOpen] = useState(false);
  const onToggleDrop = () => setDropOpen((prev) => !prev);

  const anchorRef = useRef(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2022-04-07"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const getData = useBoundStore((state) => state.getData);

  const { openDialog } = useDialogContext<ExplorerDialog>();

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
            <TextField label="Skip" defaultValue={0} />
            <TextField
              label="Limit"
              defaultValue={19}
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
          <Button
            onClick={() => {
              getData(exp._id, {});
              openDialog("DATA", { id: exp._id }, { maxWidth: "xl" });
            }}
            variant="contained"
          >
            View data
          </Button>
          <ButtonGroup
            variant="outlined"
            ref={anchorRef}
            sx={{ ml: 1, flex: "right" }}
          >
            <Button>{DownloadOptions[0].name}</Button>
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
                  {DownloadOptions.map((option) => (
                    <MenuItem key={option.name}>{option.name}</MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </CardActions>
      </Card>
    </>
  );
};
