import type { NextPage } from "next";
import dynamic from "next/dynamic";

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
