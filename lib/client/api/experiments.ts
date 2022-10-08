import { ExperimentsGetSignature } from "../../../pages/api/v2/experiments";
import { ExperimentsIdGetSignature } from "../../../pages/api/v2/experiments/[id]";
import { fetcher } from "../fetcher";
import { useExperimentStore } from "../hooks/stores/useExperimentStore";

export const getExperiments = () =>
  fetcher<ExperimentsGetSignature>({
    url: "/api/v2/experiments" as const,
    method: "GET" as const,
  }).then((exps) => useExperimentStore.getState().updateExperiments(exps));

export const getExperimentById = (id: string) =>
  fetcher<ExperimentsIdGetSignature>({
    url: "/api/v2/experiments/[id]" as const,
    method: "GET" as const,
    query: { id },
  }).then((exp) => useExperimentStore.getState().updateExperiments([exp]));
