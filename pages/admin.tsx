import type { NextPage } from "next";
import { useBoundStore } from "../lib/client/hooks/stores/useBoundStore";

const Admin: NextPage = () => {
  const userMap = useBoundStore((state) => state.userMap);

  const users = Object.values(userMap);

  return <div></div>;
};

export default Admin;
