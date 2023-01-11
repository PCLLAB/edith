import { useContext, useEffect } from "react";

import { Box } from "@mui/material";

import {
  CreateFileDialog,
  DataGridDialog,
  DeleteFileDialog,
  RenameFileDialog,
} from "../components/Dialog";
import { FileTree } from "../components/FileTree";
import { FileViewer } from "../components/FileViewer";
import { SiteWideAppBar } from "../components/SiteWideAppBar";
import {
  DialogContextProvider,
  DialogType,
} from "../lib/client/context/DialogContext";
import { ExpandedKeysProvider } from "../lib/client/context/ExpandedKeysProvider";
import { FileSelectionProvider } from "../lib/client/context/FileSelectionProvider";
import { WorkspaceContext } from "../lib/client/context/WorkspaceProvider";
import { useBoundStore } from "../lib/client/hooks/stores/useBoundStore";

import type { NextPage } from "next";
export type ExplorerDialog = DialogType<typeof ExplorerDialogRenderMap>;

const ExplorerDialogRenderMap = {
  RENAME: RenameFileDialog,
  DELETE: DeleteFileDialog,
  CREATE: CreateFileDialog,
  DATA: DataGridDialog,
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
          <Box display="flex" height="100%">
            {workspace.rootId && (
              <>
                <FileTree
                  sx={{
                    flexBasis: 320,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                />
                <FileViewer sx={{ flex: 1, m: 3 }} />
              </>
            )}
          </Box>
        </ExpandedKeysProvider>
      </FileSelectionProvider>
    </DialogContextProvider>
  );
};

export default Explorer;
