import useSWR from "swr";

import { fetcher } from "../../../lib/client/fetcher";
import { ExperimentsGetSignature } from "../../api/v2/experiments";

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

// export const useExperimentById = (id: string) => {
//   const { data, error } = useSWR(
//     { url: "/api/v2/experiments/[id]" as const, method: "GET" as const },
//     (v) => fetcher<ExperimentsIdGetSignature>(v)
//   );
//   return {
//     experiments: data,
//     loading: !error && !data,
//     error: error,
//   };
// };
