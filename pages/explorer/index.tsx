import type { NextPage } from "next";
import dynamic from "next/dynamic";
import FileNav from "../../components/FileNav/FileNav";

// const FileNav = dynamic(() => import("../../components/FileNav/FileNav"), {
//   ssr: false,
// });

const Explorer: NextPage = () => {
  return (
    <div>
      <FileNav />
    </div>
  );
};

export default Explorer;