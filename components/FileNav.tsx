import { TableHeader } from "./react-keyed-file-browser/TableHeader";
import FileBrowser from "react-keyed-file-browser";
import { Filter } from "./react-keyed-file-browser/Filter";
import { DirectoryJson, ROOT_DIRECTORY } from "../models/Directory";
import { ExperimentJson } from "../models/Experiment";
import { Common } from "../lib/common/tsUtils";
import { useDirectoryContent } from "../pages/hooks/api/directories";
import { useEffect, useState } from "react";
import { FileBrowserFile } from "react-keyed-file-browser";
// import "react-keyed-file-browser/dist/react-keyed-file-browser.css";

declare module "react-keyed-file-browser" {
  export interface FileBrowserFile
    extends Common<DirectoryJson, ExperimentJson> {
    key: string;
  }
}

const FileNav = () => {
  const [files, setFiles] = useState<FileBrowserFile[]>([]);

  const [directoryId, setDirectoryId] = useState(ROOT_DIRECTORY._id);

  const {
    content: retrievedContent,
    error,
    loading,
  } = useDirectoryContent(directoryId);

  useEffect(() => {
    if (retrievedContent == null) return;

    const newFiles = files;

    const upsertFile = (file: DirectoryJson | ExperimentJson) => {
      const key = `${file.prefixPath},${file._id}`.replaceAll(",", "/");
      const index = newFiles.findIndex((file) => file.key === key);

      const keyedFile = { ...file, key };
      if (index === -1) {
        newFiles.push(keyedFile);
      } else {
        newFiles[index] = keyedFile;
      }
    };

    retrievedContent.directories.forEach(upsertFile);
    retrievedContent.experiments.forEach(upsertFile);

    setFiles(newFiles);

    // This is run whenever retrievedContent changes. `files` should only change as a result
    // of this useEffect, so it shouldn't be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievedContent]);

  return (
    <FileBrowser
      files={files}
      filterRenderer={Filter}
      headerRenderer={TableHeader}
      onCreateFolder={() => console.log("create")}
      onCreateFiles={() => console.log("createfiles")}
      onMoveFolder={() => console.log("move folder")}
      onMoveFile={() => console.log("move file")}
    />
  );
};

export default FileNav;
