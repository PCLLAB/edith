import type { NextPage } from "next";
import dynamic from "next/dynamic";

const FileTree = dynamic(() => import("../../components/FileNav/FileTree"), {
  ssr: false,
});

const Explorer: NextPage = () => {
  return (
    <FileTree />
    // <DndProvider backend={HTML5Backend}>
    //   {/* <FileNav /> */}
    // </DndProvider>
  );
};

export default Explorer;
