import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FileNav from "../../components/FileNav/FileNav";

// const FileNav = dynamic(() => import("../../components/FileNav/FileNav"), {
//   ssr: false,
// });

const Explorer: NextPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FileNav />
    </DndProvider>
  );
};

export default Explorer;
