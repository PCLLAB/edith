import { Box, SxProps } from "@mui/material";
import { useContext } from "react";
import {
  FileSelectionContext,
  FileType,
} from "../../lib/client/context/FileSelectionProvider";
import { DirectoryViewer } from "./DirectoryViewer";
import { ExperimentViewer } from "./ExperimentViewer";

type Props = {
  sx?: SxProps;
};

export const FileViewer = ({ sx }: Props) => {
  const { fileSelection } = useContext(FileSelectionContext);
  return (
    <Box sx={sx} overflow="scroll">
      <>
        {fileSelection && fileSelection.type === FileType.EXP && (
          <ExperimentViewer experimentId={fileSelection.id} />
        )}
        {fileSelection && fileSelection.type === FileType.DIR && (
          <DirectoryViewer directoryId={fileSelection.id} />
        )}
      </>
    </Box>
  );
};
