import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FileViewer } from "../../components/FileViewer/FileViewer";
import { DirectoryFile } from "../../lib/common/models/types";

const FileTree = dynamic(() => import("../../components/FileTree"), {
  ssr: false,
});

const Explorer: NextPage = () => {
  const [fileId, setFileId] = useState<string>("Test");

  return (
    <>
      <FileTree selectFile={setFileId} selectedFile={fileId} />
      {fileId && <FileViewer fileId={fileId} />}
    </>
  );
};

export default Explorer;
