import { Paper } from "@mui/material";

import { useDirectoryById } from "../../lib/client/hooks/api/directories";

type Props = {
  directoryId: string;
};
export const DirectoryViewer = ({ directoryId }: Props) => {
  const { directory, loading, error } = useDirectoryById(directoryId);
  return <Paper>Directory viewr</Paper>;
};
