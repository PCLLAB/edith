import { DialogTitle, DialogContent } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  gridVisibleSortedRowIdsSelector,
} from "@mui/x-data-grid";
import { DialogTitleWithClose } from "./DialogTitleWithClose";

type Props = {
  onClose: () => void;
};

export const DataGridDialog = ({ onClose }: Props) => {
  return (
    <>
      <DialogTitleWithClose onClose={onClose}>Title</DialogTitleWithClose>
      <DialogContent sx={{ height: "100vh" }}>
        <DataGrid
          columns={columns}
          rows={rows}
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

const rows = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

const columns = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
];
