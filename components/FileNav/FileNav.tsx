// import { useEffect, useMemo, useState } from "react";

// import { getPath, ROOT_DIRECTORY } from "../../lib/common/models/utils";
// import { Common } from "../../lib/common/tsUtils";

// import {
//   AnyDirectory,
//   DirectoryJson,
//   ExperimentJson,
// } from "../../lib/common/models/types";
// import { ExperimentFile } from "./File/ExperimentFile";
// import { DirectoryFile } from "./File/DirectoryFile";
// import { DragPreviewLayer } from "./File/DragPreviewLayer";

// export type FileBrowserFile = (DirectoryJson | ExperimentJson) & {
//   open: boolean;
// };

// type FileNavProps = {
//   // onSelectFile: (file: DirectoryJson | ExperimentJson) => void;
// };

// const testDirs: DirectoryJson[] = [
//   {
//     _id: "dirid",
//     name: "level 1",
//     ownerIds: [],
//     namedPrefixPath: "Root",
//     prefixPath: "r",
//     createdAt: "fake date",
//     updatedAt: "fake date2",
//   },
//   {
//     _id: "dirid2",
//     name: "level 2",
//     ownerIds: [],
//     namedPrefixPath: "Root,level1",
//     prefixPath: "r,dirid",
//     createdAt: "fake date",
//     updatedAt: "fake date2",
//   },
// ];

// const testExps: ExperimentJson[] = [
//   {
//     _id: "o2wd8",
//     name: "First Exp",
//     enabled: true,
//     dataCollection: "dasf",
//     user: "asadfasdf2",
//     prefixPath: "r",
//     createdAt: "fake date",
//     updatedAt: "fake date2",
//   },
//   {
//     _id: "asf8io",
//     name: "second Exp",
//     enabled: true,
//     dataCollection: "dasf",
//     user: "asadfasdf2",
//     prefixPath: "r,dirid",
//     createdAt: "fake date",
//     updatedAt: "fake date2",
//   },
//   {
//     _id: "a08i3k",
//     name: "third Exp",
//     enabled: true,
//     dataCollection: "dasf",
//     user: "asadfasdf2",
//     prefixPath: "r,dirid,dirid2",
//     createdAt: "fake date",
//     updatedAt: "fake date2",
//   },
//   {
//     _id: "o2wd8sdf",
//     name: "fourth Exp",
//     enabled: true,
//     dataCollection: "dasf",
//     user: "asadfasdf2",
//     prefixPath: "r,dirid,dirid2",
//     createdAt: "fake date",
//     updatedAt: "fake date2",
//   },
// ];

// const FileNav = () => {
//   const [files, setFiles] = useState<FileBrowserFile[]>([]);

//   const [currentDir, setCurrentDir] = useState<AnyDirectory>(ROOT_DIRECTORY);
//   // const {
//   //   content: retrievedContent,
//   //   error,
//   //   loading,
//   // } = useDirectoryContent(directoryId);

//   const retrievedContent = useMemo(
//     () => ({
//       experiments: testExps,
//       directories: testDirs,
//     }),
//     []
//   );

//   useEffect(() => {
//     if (retrievedContent == null) return;

//     const updatedPath = getPath(currentDir);

//     const openIds: string[] = [];

//     const unAffectedFiles = files.filter((file) => {
//       if (file.prefixPath === updatedPath) {
//         if (file.open) openIds.push(file._id);
//         return false;
//       }

//       return true;
//     });

//     const updatedExps = retrievedContent.experiments.map((exp) => ({
//       ...exp,
//       open: openIds.includes(exp._id),
//     }));
//     const updatedDirs = retrievedContent.directories.map((dir) => ({
//       ...dir,
//       open: openIds.includes(dir._id),
//     }));

//     const newFiles = unAffectedFiles.concat(updatedExps, updatedDirs);

//     setFiles(newFiles);
//     // `files` should only change as a result of
//     // this useEffect, so it shouldn't be a dependency
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [retrievedContent]);

//   return (
//     <>
//       <DragPreviewLayer />
//       {files.map((file) =>
//         "namedPrefixPath" in file ? (
//           <DirectoryFile directory={file} />
//         ) : (
//           <ExperimentFile experiment={file} />
//         )
//       )}
//     </>
//   );
// };

// export default FileNav;
