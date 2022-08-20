import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { ROOT_DIRECTORY } from "../../models/Directory";
import { useDirectoryContent } from "../hooks/api/directories";

const FileNav = dynamic(() => import("../../components/FileNav"), {
  ssr: false,
});

const Explorer: NextPage = () => {
  return (
    <div>
      <FileNav />
    </div>
  );
};

export default Explorer;
