import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FileViewer } from "../../components/FileViewer/FileViewer";

const FileTree = dynamic(() => import("../../components/FileNav/FileTree"), {
  ssr: false,
});

const Explorer: NextPage = () => {
  const [fileId, setFileId] = useState<string>();

  return (
    <>
      <FileTree selectFile={setFileId} />
      {fileId && <FileViewer fileId={fileId} />}
    </>
  );
};

export default Explorer;
