import { DialogContent } from "@mui/material";

import { useMemo, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { DialogTitleWithClose } from "./DialogTitleWithClose";
import { groupBy as rowGrouper } from "lodash-es";
import { DataEntryJson } from "../../lib/common/types/models";

type Props = {
  onClose: () => void;
  id: string;
};

export const DataGridDialog = ({ onClose, id }: Props) => {
  const entries = useBoundStore((state) => state.dataMap[id]?.entries ?? []);
  return <GridDialogBase onClose={onClose} id={id} entries={entries} />;
};

export const CacheGridDialog = ({ onClose, id }: Props) => {
  const entries = useBoundStore((state) => state.cacheMap[id] ?? []);
  return <GridDialogBase onClose={onClose} id={id} entries={entries} />;
};

const GridDialogBase = ({
  onClose,
  id,
  entries,
}: Props & { entries: DataEntryJson[] }) => {
  const exp = useBoundStore((state) => state.experimentMap[id]);

  // add unique row id to each row
  const rows: Record<string, any>[] = useMemo(
    () =>
      entries
        .flatMap((entry) =>
          entry.data.map((row) => ({ ...row, _entry: entry._id }))
        )
        .map((row, index) => ({ ...row, _id: index })),
    [entries]
  );

  const uniqueKeys = useMemo(
    () =>
      rows.reduce<Set<string>>((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set()),
    [rows]
  );

  uniqueKeys.delete("_id");
  uniqueKeys.delete("_entry");

  const columns = Array.from(uniqueKeys).map((key) => ({ key, name: key }));

  const [expanded, setExpanded] = useState(new Set());

  return (
    <>
      <DialogTitleWithClose onClose={onClose}>{exp.name}</DialogTitleWithClose>
      <DialogContent sx={{ height: "100vh" }}>
        {/* TODO use TreeDataGrid once new version published */}
        <DataGrid
          columns={columns}
          rows={rows}
          rowKeyGetter={(r) => r._id}
          expandedGroupIds={expanded}
          onExpandedGroupIdsChange={setExpanded}
          groupBy={["_entry"]}
          rowGrouper={rowGrouper}
          defaultColumnOptions={{ resizable: true }}
        />
      </DialogContent>
    </>
  );
};
