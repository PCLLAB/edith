import useSWR from "swr";

import { fetcher } from "../../../lib/client/fetcher";
import { UsersGetSignature } from "../../api/v2/users";
import { UsersIdGetSignature } from "../../api/v2/users/[id]";

export const useUsers = () => {
  const { data, error } = useSWR(
    { url: "/api/v2/users" as const, method: "GET" as const },
    (v) => fetcher<UsersGetSignature>(v)
  );
  return {
    users: data,
    loading: !error && !data,
    error: error,
  };
};

export const useUserById = (id: string) => {
  const { data, error } = useSWR(
    {
      url: "/api/v2/users/[id]" as const,
      method: "GET" as const,
      query: { id },
    },
    (v) => fetcher<UsersIdGetSignature>(v)
  );
  return {
    user: data,
    loading: !error && !data,
    error: error,
  };
};
