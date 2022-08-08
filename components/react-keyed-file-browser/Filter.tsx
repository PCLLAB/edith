import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import type { FilterRenderer } from "react-keyed-file-browser";

export const Filter: FilterRenderer = ({ value, updateFilter }) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFilter(e.target.value);
  };
  return (
    <TextField
      size="small"
      value={value}
      onChange={onChange}
      placeholder="Filter experiments..."
    />
  );
};
