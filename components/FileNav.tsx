import { useState } from "react";

import { ROOT_DIRECTORY } from "../lib/common/models/utils";
import { Common } from "../lib/common/tsUtils";

import type { DirectoryJson, ExperimentJson } from "../lib/common/models/types";

export interface FileBrowserFile extends Common<DirectoryJson, ExperimentJson> {
  key: string;
}

type FileNavProps = {
  // onSelectFile: (file: DirectoryJson | ExperimentJson) => void;
};

const testFiles = [
  { key: "test/whatevs" },
  { key: "test/whatevs2" },
  { key: "test/whatevs3" },
  { key: "test/whatevs4" },
  { key: "test/whatevs folder/" },
  { key: "test/whatevs folder/inside" },
  { key: "test/whatevs folder/another one/" },
];

const FileNav = () => {
  const [files, setFiles] = useState<FileBrowserFile[]>([]);

  const [directoryId, setDirectoryId] = useState(ROOT_DIRECTORY._id);

  // const {
  //   content: retrievedContent,
  //   error,
  //   loading,
  // } = useDirectoryContent(directoryId);

  // useEffect(() => {
  //   if (retrievedContent == null) return;

  //   const newFiles = files;

  //   const upsertFile =
  //     (folder: boolean = false) =>
  //     (file: DirectoryJson | ExperimentJson) => {
  //       // rkfb uses a terminating "/" to describe folders
  //       const fileId = folder ? `${file._id},` : file._id;

  //       // Remove "r," and convert "," to "/"
  //       const key = `${file.prefixPath},${fileId}`
  //         .slice(2)
  //         .replaceAll(",", "/");
  //       const index = newFiles.findIndex((file) => file.key === key);

  //       const keyedFile = { ...file, key };
  //       if (index === -1) {
  //         newFiles.push(keyedFile);
  //       } else {
  //         newFiles[index] = keyedFile;
  //       }
  //     };

  //   retrievedContent.directories.forEach(upsertFile(true));
  //   retrievedContent.experiments.forEach(upsertFile());

  //   setFiles(newFiles);

  //   // This is run whenever retrievedContent changes.
  //   // `files` should only change as a result of
  //   // this useEffect, so it shouldn't be a dependency
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [retrievedContent]);

  return (
    <></>
    // <FileBrowser
    //   files={testFiles}
    //   // files={files}
    //   detailRenderer={(() => <></>) as DetailRenderer}
    //   filterRenderer={Filter}
    //   headerRenderer={TableHeader}
    //   onCreateFolder={() => console.log("create")}
    //   onCreateFiles={() => console.log("createfiles")}
    //   onMoveFolder={() => console.log("move folder")}
    //   onMoveFile={() => console.log("move file")}
    // />
  );
};

export default FileNav;
