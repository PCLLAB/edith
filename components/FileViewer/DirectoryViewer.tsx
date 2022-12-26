import { Paper } from "@mui/material";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";

type Props = {
  directoryId: string;
};

export const DirectoryViewer = ({ directoryId }: Props) => {
  const directory = useBoundStore((state) => state.directory[directoryId]);
  return <Paper>Directory viewr</Paper>;
};
