import { createContext, useState } from "react";

import { styled } from "@mui/material";

import FileTree from "../../components/FileTree";
import { DirectoryViewer } from "../../components/FileViewer/DirectoryViewer";
import { ExperimentViewer } from "../../components/FileViewer/ExperimentViewer";

import type { NextPage } from "next";
import { FileSelectionProvider } from "../../components/FileTree/FileSelectionProvider";
const ExplorerBox = styled("div")({
  display: "flex",
  flexDirection: "row",
  height: "100%",
});

const FileNavSideBar = styled(FileTree)({
  flexBasis: 320,
});
const FileViewer = styled("div")((props) => ({
  flex: 1,
  margin: props.theme.spacing(3),
}));

const Explorer: NextPage = () => {
  const [fileId, setFileId] = useState<string>();
  const [expId, setExpId] = useState<string>();
  const [dirId, setDirId] = useState<string>();

  const selectDirectory = (id: string) => {
    setDirId(id);
    setFileId(id);
  };
  const selectExperiment = (id: string) => {
    setExpId(id);
    setFileId(id);
  };

  return (
    <FileSelectionProvider>
      <ExplorerBox>
        <FileNavSideBar
          selectDirectory={selectDirectory}
          selectExperiment={selectExperiment}
        />
        <FileViewer>
          {fileId && fileId === expId && (
            <ExperimentViewer experimentId={expId} />
          )}
          {fileId && fileId === dirId && (
            <DirectoryViewer directoryId={dirId} />
          )}
        </FileViewer>
      </ExplorerBox>
    </FileSelectionProvider>
  );
};

export default Explorer;
