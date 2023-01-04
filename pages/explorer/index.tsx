import { styled } from "@mui/material";

import { FileTree } from "../../components/FileTree";
import { FileViewer } from "../../components/FileViewer";
import { FileSelectionProvider } from "../../lib/client/context/FileSelectionProvider";

import type { NextPage } from "next";
import { WorkspaceContext } from "../../lib/client/context/WorkspaceProvider";
import { useContext, useEffect } from "react";
import { useBoundStore } from "../../lib/client/hooks/stores/useBoundStore";
import { AuthContextProvider } from "../../lib/client/context/AuthProvider";
import { ExpandedKeysProvider } from "../../lib/client/context/ExpandedKeysProvider";

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
  const { workspace, setWorkspace } = useContext(WorkspaceContext);

  const getDirectoryRoots = useBoundStore((state) => state.getDirectoryRoots);

  useEffect(() => {
    getDirectoryRoots().then((dirs) =>
      setWorkspace({
        rootId: dirs[0]._id,
      })
    );
  }, []);

  return (
    <AuthContextProvider>
      <FileSelectionProvider>
        <ExpandedKeysProvider>
          <ExplorerBox>
            {workspace.rootId && (
              <>
                <StyledFileTree />
                <StyledFileViewer />
              </>
            )}
          </ExplorerBox>
        </ExpandedKeysProvider>
      </FileSelectionProvider>
    </AuthContextProvider>
  );
};

export default Explorer;
