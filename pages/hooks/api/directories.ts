import useSWR from "swr";

import { fetcher } from "../../../lib/client/fetcher";
import { DirectoriesGetSignature } from "../../api/v2/directories";
import { DirectoriesIdGetSignature } from "../../api/v2/directories/[id]";

export const useDirectories = () => {
  const { data, error } = useSWR(
    { url: "/api/v2/directories" as const, method: "GET" as const },
    (v) => fetcher<DirectoriesGetSignature>(v)
  );
  return {
    directories: data,
    loading: !error && !data,
    error: error,
  };
};

export const useDirectoryById = (id: string) => {
  const { data, error } = useSWR(
    {
      url: "/api/v2/directories/[id]" as const,
      method: "GET" as const,
      query: { id },
    },
    (v) => fetcher<DirectoriesIdGetSignature>(v)
  );
  return {
    directory: data,
    loading: !error && !data,
    error: error,
  };
};
