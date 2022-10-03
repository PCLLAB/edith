import useSWR from "swr";

import { fetcher } from "../../fetcher";
import { ExperimentsGetSignature } from "../../../../pages/api/v2/experiments";
import { ExperimentsIdGetSignature } from "../../../../pages/api/v2/experiments/[id]";

export const useExperiments = () => {
  const { data, error } = useSWR(
    { url: "/api/v2/experiments" as const, method: "GET" as const },
    (v) => fetcher<ExperimentsGetSignature>(v)
  );
  return {
    experiments: data,
    loading: !error && !data,
    error: error,
  };
};

export const useExperimentById = (id: string) => {
  const { data, error } = useSWR(
    {
      url: "/api/v2/experiments/[id]" as const,
      method: "GET" as const,
      query: { id },
    },
    (v) => fetcher<ExperimentsIdGetSignature>(v)
  );
  return {
    experiment: data,
    loading: !error && !data,
    error: error,
  };
};
