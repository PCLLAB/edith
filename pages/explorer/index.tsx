import { styled } from "@mui/material";

import { FileTree } from "../../components/FileTree";
import { FileViewer } from "../../components/FileViewer";
import { FileSelectionProvider } from "../../lib/client/context/FileSelectionProvider";

import type { NextPage } from "next";

const ExplorerBox = styled("div")({
  display: "flex",
  flexDirection: "row",
  height: "100%",
});

const StyledFileTree = styled(FileTree)({
  flexBasis: 320,
});
const StyledFileViewer = styled(FileViewer)((props) => ({
  flex: 1,
  margin: props.theme.spacing(3),
}));

const Explorer: NextPage = () => {
  console.debug("explorer render");
  return (
    <FileSelectionProvider>
      <ExplorerBox>
        <StyledFileTree />
        <StyledFileViewer />
      </ExplorerBox>
    </FileSelectionProvider>
  );
};

export default Explorer;
