import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import FileNav from "../../components/FileNav/FileNav";
// import { FileTree } from "../../components/FileNav/FileTree";

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
