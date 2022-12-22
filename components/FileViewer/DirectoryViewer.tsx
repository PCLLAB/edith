import { Paper } from "@mui/material";

import { useDirectoryStore } from "../../lib/client/hooks/stores/useDirectoryStore";

type Props = {
  directoryId: string;
};

export const DirectoryViewer = ({ directoryId }: Props) => {
  const directory = useDirectoryStore(
    (state) => state.directories[directoryId]
  );
  return <Paper>Directory viewr</Paper>;
};
