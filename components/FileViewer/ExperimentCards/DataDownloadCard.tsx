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
import dayjs, { Dayjs } from "dayjs";

type CardProps = {
  exp: ExperimentJson;
};

export const DataDownloadCard = ({ exp }: CardProps) => {
  const [dropOpen, setDropOpen] = useState(false);
  const onToggleDrop = () => setDropOpen((prev) => !prev);

  const anchorRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      skip: "",
      limit: "",
      startDate: null,
      endDate: null,
    },
  });

  const queryData = ({
    skip,
    limit,
    startDate,
    endDate,
  }: {
    skip: string;
    limit: string;
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }) => {
    return getData(exp._id, {
      skip: dirtyFields.skip ? parseInt(skip) : undefined,
      limit: dirtyFields.limit ? parseInt(limit) : undefined,
      startDate: dirtyFields.startDate ? startDate!.toISOString() : undefined,
      endDate: dirtyFields.endDate ? endDate!.toISOString() : undefined,
    });
  };

  const onSubmit = handleSubmit(async (options) => {
    setLoading(true);
    await queryData(options);
    setLoading(false);
    openDialog("DATA", { id: exp._id }, { maxWidth: "xl" });
  });

  const DownloadOptions = [
    {
      name: "Download as CSV",
      onClick: handleSubmit(async (options) => {
        const entries = await queryData(options);

        const rows = entries.flatMap((entry) => entry.data);

        const colSet = new Set<string>();
        rows.forEach((row) => {
          Object.keys(row).forEach((key) => colSet.add(key));
        });
        const cols = Array.from(colSet);

        const csvList = rows.map((row) =>
          cols.map((col) => (col in row ? row[col] : "")).join(",")
        );
        csvList.unshift(cols.join(","));
        const csv = csvList.join("\r\n");

        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = "test_title.csv";
        a.click();
      }),
    },
    {
      name: "Download as JSON",
      onClick: handleSubmit(async (options) => {
        const entries = await queryData(options);

        const a = document.createElement("a");
        a.href = URL.createObjectURL(
          new Blob([JSON.stringify(entries)], { type: "application/json" })
        );
        a.download = "test_title.json";
        a.click();
      }),
    },
  ];
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
            (Optional) Set number of entries to skip and/or limit the number of
            entries loaded. Skip and limit occurs after entries are filtered by
            date range if applied.
          </Typography>
          <Box display="flex" flexWrap="wrap" sx={{ gap: 2, my: 2 }}>
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
            (Optional) Select data between start and end (inclusive).
          </Typography>
          <Box display="flex" flexWrap="wrap" sx={{ gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  validate: (v: Dayjs | null) => v == null || v.isValid(),
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
                  validate: (v: Dayjs | null) => v == null || v.isValid(),
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
            <Button onClick={DownloadOptions[0].onClick}>
              {DownloadOptions[0].name}
            </Button>
            <Button size="small" onClick={onToggleDrop}>
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{ zIndex: 1 }}
            open={dropOpen}
            // disablePortal
            anchorEl={anchorRef.current}
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <Paper>
              <ClickAwayListener onClickAway={onToggleDrop}>
                <MenuList autoFocusItem>
                  {DownloadOptions.map((option) => (
                    <MenuItem key={option.name} onClick={option.onClick}>
                      {option.name}
                    </MenuItem>
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
