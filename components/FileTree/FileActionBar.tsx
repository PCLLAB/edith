import NewDirectoryIcon from "@mui/icons-material/CreateNewFolder";
import NewExperimentIcon from "@mui/icons-material/NoteAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Paper, styled, Tooltip } from "@mui/material";

const ActionBar = styled(Paper)({
  display: "flex",
  justifyContent: "end",
  borderRadius: 0,
});

type Props = {
  onNewExperiment: () => void;
  onNewDirectory: () => void;
  onRefresh: () => void;
};

export const FileActionBar = ({
  onNewDirectory,
  onNewExperiment,
  onRefresh,
}: Props) => {
  return (
    <ActionBar elevation={1}>
      <Tooltip title="New Experiment">
        <IconButton size="small" onClick={onNewExperiment}>
          <NewExperimentIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="New Folder">
        <IconButton size="small" onClick={onNewDirectory}>
          <NewDirectoryIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh Files">
        <IconButton size="small" onClick={onRefresh}>
          <RefreshIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </ActionBar>
  );
};
