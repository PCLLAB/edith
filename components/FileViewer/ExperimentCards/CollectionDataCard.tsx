import { useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import { Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { useBoundStore } from "../../../lib/client/hooks/stores/useBoundStore";
import { ExperimentJson } from "../../../lib/common/types/models";
import { getLocalDayISO } from "../../../lib/common/utils";

type CardProps = {
  exp: ExperimentJson;
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

export const CollectionDataCard = ({ exp }: CardProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const endDate = useMemo(
    () => (selectedYear == null ? new Date() : new Date(selectedYear, 11, 31)),
    [selectedYear]
  );
  const startDate = getMinusYear(endDate);

  const expMeta = useBoundStore((store) => store.metadataMap[exp._id]);

  const years = (() => {
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
        const count = expMeta?.activityLog[localDateKey!] ?? 0;
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
