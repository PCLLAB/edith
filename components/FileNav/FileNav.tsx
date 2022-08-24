import { useEffect, useState } from "react";

import { getPath, ROOT_DIRECTORY } from "../../lib/common/models/utils";
import { Common } from "../../lib/common/tsUtils";

import {
  AnyDirectory,
  DirectoryJson,
  ExperimentJson,
} from "../../lib/common/models/types";

export type FileBrowserFile = Common<DirectoryJson, ExperimentJson>;

type FileNavProps = {
  // onSelectFile: (file: DirectoryJson | ExperimentJson) => void;
};

const testDirs: DirectoryJson[] = [
  {
    _id: "dirid",
    name: "level 1",
    ownerIds: [],
    namedPrefixPath: "Root",
    prefixPath: "r",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "dirid2",
    name: "level 2",
    ownerIds: [],
    namedPrefixPath: "Root,level1",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
];

const testExps: ExperimentJson[] = [
  {
    _id: "o2wd8",
    name: "First Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "asf8io",
    name: "second Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "a08i3k",
    name: "third Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid,dirid2",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
  {
    _id: "o2wd8sdf",
    name: "fourth Exp",
    enabled: true,
    dataCollection: "dasf",
    user: "asadfasdf2",
    prefixPath: "r,dirid,dirid2",
    createdAt: "fake date",
    updatedAt: "fake date2",
  },
];

const FileNav = () => {
  const [files, setFiles] = useState<FileBrowserFile[]>([]);

  // const [directoryId, setDirectoryId] = useState(ROOT_DIRECTORY._id);

  const [currentDir, setCurrentDir] = useState<AnyDirectory>(ROOT_DIRECTORY);
  // const {
  //   content: retrievedContent,
  //   error,
  //   loading,
  // } = useDirectoryContent(directoryId);

  const retrievedContent = {
    experiments: testExps,
    directories: testDirs,
  };

  useEffect(() => {
    if (retrievedContent == null) return;

    const affectedPath = getPath(currentDir);
    const unAffectedFiles = files.filter(
      (file) => file.prefixPath !== affectedPath
    );

    const newFiles = unAffectedFiles.concat(
      retrievedContent.experiments,
      retrievedContent.directories
    );

    setFiles(newFiles);

    // This is run whenever retrievedContent changes.
    // `files` should only change as a result of
    // this useEffect, so it shouldn't be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievedContent]);

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
