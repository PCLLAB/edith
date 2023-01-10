import { useContext, useEffect } from "react";

import { styled } from "@mui/material";

import { FileTree } from "../components/FileTree";
import { FileViewer } from "../components/FileViewer";
import { ExpandedKeysProvider } from "../lib/client/context/ExpandedKeysProvider";
import { FileSelectionProvider } from "../lib/client/context/FileSelectionProvider";
import { WorkspaceContext } from "../lib/client/context/WorkspaceProvider";
import { useBoundStore } from "../lib/client/hooks/stores/useBoundStore";

import type { NextPage } from "next";
import { SiteWideAppBar } from "../components/SiteWideAppBar";
import {
  DialogType,
  DialogContextProvider,
} from "../lib/client/context/DialogContext";
import {
  CreateFileDialog,
  DeleteFileDialog,
  RenameFileDialog,
} from "../components/Dialog";

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

export type ExplorerDialog = DialogType<typeof ExplorerDialogRenderMap>;

const ExplorerDialogRenderMap = {
  RENAME: RenameFileDialog,
  DELETE: DeleteFileDialog,
  CREATE: CreateFileDialog,
};

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
    <DialogContextProvider rendererMap={ExplorerDialogRenderMap}>
      <FileSelectionProvider>
        <ExpandedKeysProvider>
          <SiteWideAppBar />
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
    </DialogContextProvider>
  );
};

export default Explorer;
