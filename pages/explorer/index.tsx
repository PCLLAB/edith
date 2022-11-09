import { useContext } from "react";

import { styled } from "@mui/material";

import FileTree from "../../components/FileTree";
import {
  DirectoryFileType,
  FileSelectionContext,
  FileSelectionProvider,
} from "../../components/FileTree/FileSelectionProvider";
import { DirectoryViewer } from "../../components/FileViewer/DirectoryViewer";
import { ExperimentViewer } from "../../components/FileViewer/ExperimentViewer";

import type { NextPage } from "next";
const ExplorerBox = styled("div")({
  display: "flex",
  flexDirection: "row",
  height: "100%",
});

const FileNavSideBar = styled(FileTree)({
  flexBasis: 320,
});
const FileViewerSection = styled("div")((props) => ({
  flex: 1,
  margin: props.theme.spacing(3),
}));

const Explorer: NextPage = () => {
  const { fileSelection } = useContext(FileSelectionContext);

  return (
    <FileSelectionProvider>
      <ExplorerBox>
        <FileNavSideBar />
        <FileViewerSection>
          {fileSelection && fileSelection.type === DirectoryFileType.EXP && (
            <ExperimentViewer experimentId={fileSelection.id} />
          )}
          {fileSelection && fileSelection.type === DirectoryFileType.DIR && (
            <DirectoryViewer directoryId={fileSelection.id} />
          )}
        </FileViewerSection>
      </ExplorerBox>
    </FileSelectionProvider>
  );
};

export default Explorer;
