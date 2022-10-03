import useSWR from "swr";

import { DirectoriesGetSignature } from "../../../../pages/api/v2/directories";
import { DirectoriesIdGetSignature } from "../../../../pages/api/v2/directories/[id]";
import { DirectoriesIdChildrenGetSignature } from "../../../../pages/api/v2/directories/[id]/children";
import { fetcher } from "../../fetcher";

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

export const useDirectoryContent = (id: string) => {
  const { data, error } = useSWR(
    {
      url: "/api/v2/directories/[id]/children" as const,
      method: "GET" as const,
      query: { id },
    },
    (v) => fetcher<DirectoriesIdChildrenGetSignature>(v)
  );
  return {
    content: data,
    loading: !error && !data,
    error: error,
  };
};
