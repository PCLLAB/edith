import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";

import "react-keyed-file-browser/dist/react-keyed-file-browser.css";

// TODO import the actual entire file browser component as no SSR
// import CustomHeader from "../components/react-keyed-file-browser/myTableHeader";
const CustomHeader = dynamic(() => import("../components/react-keyed-file-browser/myTableHeader"), {
  ssr: false,
});
// Errors when using SSR, weird workaround for now
const FileBrowser = dynamic(() => import("react-keyed-file-browser"), {
  ssr: false,
});
const testfiles = [
  {
    key: "photos/animals/cat in a hat.png",
    modified: Date.now(),
    size: 1.5 * 1024 * 1024,
  },
  {
    key: "photos/animals/kitten_ball.png",
    modified: Date.now(),
    size: 545 * 1024,
  },
  {
    key: "photos/animals/elephants/",
  },
  {
    key: "photos/funny fall.gif",
    modified: Date.now(),
    size: 13.2 * 1024 * 1024,
  },
  {
    key: "photos/holiday.jpg",
    modified: Date.now(),
    size: 85 * 1024,
  },
  {
    key: "documents/letter chunks.doc",
    modified: Date.now(),
    size: 480 * 1024,
  },
  {
    key: "documents/export.pdf",
    modified: Date.now(),
    size: 4.2 * 1024 * 1024,
  },
];
const Home: NextPage = () => {
  return (
    <div>
      <FileBrowser
        files={testfiles}
        headerRenderer={CustomHeader}
        onCreateFolder={() => console.log("create")}
        onCreateFiles={() => console.log("createfiles")}
        onMoveFolder={() => console.log("move folder")}
        onMoveFile={() => console.log("move file")}
        
      />
    </div>
  );
};

export default Home;
