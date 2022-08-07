import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect } from "react";
// import FileNav from "../components/FileNav";

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
