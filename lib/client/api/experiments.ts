import {
  ExperimentsGetSignature,
  ExperimentsPostSignature,
} from "../../../pages/api/v2/experiments";
import {
  ExperimentsIdGetSignature,
  ExperimentsIdPutSignature,
} from "../../../pages/api/v2/experiments/[id]";
import { fetcher } from "../fetcher";
import { useExperimentStore } from "../hooks/stores/useExperimentStore";

export const getExperiments = () =>
  fetcher<ExperimentsGetSignature>({
    url: "/api/v2/experiments" as const,
    method: "GET" as const,
  }).then((exps) => useExperimentStore.getState().updateExperiments(exps));

export const getExperiment = (id: string) =>
  fetcher<ExperimentsIdGetSignature>({
    url: "/api/v2/experiments/[id]" as const,
    method: "GET" as const,
    query: { id },
  }).then((exp) => useExperimentStore.getState().updateExperiments([exp]));

/**
 * Optimistic update that will rollback on failure
 */
export const updateExperiment = async (
  id: string,
  update: ExperimentsIdPutSignature["body"]
) => {
  const original = useExperimentStore.getState().experiments[id];
  const optimistic = {
    ...original,
    ...update,
  };

  useExperimentStore.getState().updateExperiments([optimistic]);

  try {
    const exp = await fetcher<ExperimentsIdPutSignature>({
      url: "/api/v2/experiments/[id]" as const,
      method: "PUT" as const,
      query: { id },
      body: update,
    });
    useExperimentStore.getState().updateExperiments([exp]);
  } catch {
    useExperimentStore.getState().updateExperiments([original]);
  }
};

export const createExperiment = (body: ExperimentsPostSignature["body"]) =>
  fetcher<ExperimentsPostSignature>({
    url: "/api/v2/experiments" as const,
    method: "POST" as const,
    body,
  }).then((exp) => useExperimentStore.getState().updateExperiments([exp]));
