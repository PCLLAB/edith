import type { NextPage } from "next";
import dynamic from "next/dynamic";
import useSWR from "swr";

import { fetcher } from "../../lib/client/fetcher";
import { UsersGetSignature } from "../api/v2/users";

// import FileNav from "../components/FileNav";

const FileNav = dynamic(() => import("../../components/FileNav"), {
  ssr: false,
});

const Explorer: NextPage = () => {
  const { data, error } = useSWR(
    { url: "/api/v2/users" as const, method: "GET" as const },
    (data) => fetcher<UsersGetSignature>(data)
  );
  return (
    <div>
      <FileNav />
    </div>
  );
};

export default Explorer;
