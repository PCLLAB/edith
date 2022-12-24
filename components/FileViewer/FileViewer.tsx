import { Box } from "@mui/material";
import { useContext } from "react";
import {
  FileSelectionContext,
  FileType,
} from "../../lib/client/context/FileSelectionProvider";
import { DirectoryViewer } from "./DirectoryViewer";
import { ExperimentViewer } from "./ExperimentViewer";

export const FileViewer = () => {
  const { fileSelection } = useContext(FileSelectionContext);
  return (
    <Box
      sx={{
        overflowY: "scroll",
        flex: "1",
      }}
    >
      {fileSelection && fileSelection.type === FileType.EXP && (
        <ExperimentViewer experimentId={fileSelection.id} />
      )}
      {fileSelection && fileSelection.type === FileType.DIR && (
        <DirectoryViewer directoryId={fileSelection.id} />
      )}
    </Box>
  );
};
