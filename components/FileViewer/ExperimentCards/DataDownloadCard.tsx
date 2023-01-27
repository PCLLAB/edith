import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LoadingButton from "@mui/lab/LoadingButton";
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

  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { dirtyFields, isValid },
  } = useForm({
    defaultValues: {
      skip: "",
      limit: "",
      startDate: null,
      endDate: null,
    },
  });

  const onSubmit = handleSubmit(async ({ skip, limit, startDate, endDate }) => {
    setLoading(true);
    await getData(exp._id, {
      skip: dirtyFields.skip ? parseInt(skip) : undefined,
      limit: dirtyFields.limit ? parseInt(limit) : undefined,
      startDate: dirtyFields.startDate ? startDate.toISOString() : undefined,
      endDate: dirtyFields.endDate ? endDate.toISOString() : undefined,
    });
    setLoading(false);
    openDialog("DATA", { id: exp._id }, { maxWidth: "xl" });
  });

  const getData = useBoundStore((state) => state.getData);

  const { openDialog } = useDialogContext<ExplorerDialog>();
  console.log("isvalid", isValid);
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
            <TextField
              label="Skip"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              {...register("skip", {
                min: 0,
                validate: (v) => v === "" || !isNaN(parseInt(v)),
              })}
            />
            <TextField
              label="Limit"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              {...register("limit", {
                min: 0,
                validate: (v) => v === "" || !isNaN(parseInt(v)),
              })}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Select data between start and end (inclusive).
          </Typography>
          <Box display="flex" flexWrap="wrap" sx={{ gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  validate: (v) => v == null || v.isValid(),
                }}
                render={({ field }) => (
                  <DateTimePicker
                    label="Start"
                    renderInput={(props) => <TextField {...props} />}
                    {...field}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                rules={{
                  validate: (v) => v == null || v.isValid(),
                }}
                render={({ field }) => (
                  <DateTimePicker
                    label="End"
                    renderInput={(props) => <TextField {...props} />}
                    {...field}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <LoadingButton
            onClick={onSubmit}
            variant="contained"
            loading={loading}
          >
            View data
          </LoadingButton>
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
