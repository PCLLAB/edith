import { DialogContent } from "@mui/material";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  gridVisibleSortedRowIdsSelector,
} from "@mui/x-data-grid";

import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

type Props = {
  onClose: () => void;
  id: string;
};

export const DataGridDialog = ({ onClose, id }: Props) => {
  const entries = useBoundStore((state) => state.dataMap[id]?.entries ?? []);

  // add unique row id to each row
  const rows: Record<string, any>[] = entries.flatMap((entry) => entry.data);

  const columns = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set())
  ).map((field) => ({ field }));

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>Title</DialogTitleWithClose>
      <DialogContent sx={{ height: "100vh" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(r) => r._id}
          components={{ Toolbar: CustomToolbar }}
        />
      </DialogContent>
    </>
  );
};

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      />
      <GridToolbarFilterButton
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      />
      <GridToolbarDensitySelector
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      />
      <GridToolbarExport
        csvOptions={{ getRowsToExport: gridVisibleSortedRowIdsSelector }}
      />
    </GridToolbarContainer>
  );
};

const columns = [{ field: "col1" }, { field: "col2", width: 150 }];
