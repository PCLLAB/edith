import useSWR from "swr";

import { UsersGetSignature } from "../../../../pages/api/v2/users";
import { UsersIdGetSignature } from "../../../../pages/api/v2/users/[id]";
import { fetcher } from "../../fetcher";

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
