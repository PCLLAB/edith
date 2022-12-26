import {
  ExperimentsGetSignature,
  ExperimentsPostSignature,
} from "../../../pages/api/v2/experiments";
import {
  ExperimentsIdGetSignature,
  ExperimentsIdPutSignature,
} from "../../../pages/api/v2/experiments/[id]";
import { ExperimentsIdMetaGetSignature } from "../../../pages/api/v2/experiments/[id]/meta";
import { fetcher } from "../fetcher";
import { useBoundStore } from "../hooks/stores/useBoundStore";

export const getExperiments = () =>
  fetcher<ExperimentsGetSignature>({
    url: "/api/v2/experiments" as const,
    method: "GET" as const,
  }).then((exps) => useBoundStore.getState().updateExperiments(exps));

export const getExperiment = (id: string) =>
  fetcher<ExperimentsIdGetSignature>({
    url: "/api/v2/experiments/[id]" as const,
    method: "GET" as const,
    query: { id },
  }).then((exp) => useBoundStore.getState().updateExperiments([exp]));

export const getExperimentMeta = (id: string) =>
  fetcher<ExperimentsIdMetaGetSignature>({
    url: "/api/v2/experiments/[id]/meta" as const,
    method: "GET" as const,
    query: { id },
  }).then((meta) => useBoundStore.getState().updateExperimentMeta(id, meta));

/**
 * Optimistic update that will rollback on failure
 */
export const updateExperiment = async (
  id: string,
  update: ExperimentsIdPutSignature["body"]
) => {
  const original = useBoundStore.getState().experiment[id];
  const optimistic = {
    ...original,
    ...update,
  };

  useBoundStore.getState().updateExperiments([optimistic]);

  try {
    const exp = await fetcher<ExperimentsIdPutSignature>({
      url: "/api/v2/experiments/[id]" as const,
      method: "PUT" as const,
      query: { id },
      body: update,
    });
    useBoundStore.getState().updateExperiments([exp]);
  } catch {
    useBoundStore.getState().updateExperiments([original]);
  }
};

export const createExperiment = (body: ExperimentsPostSignature["body"]) =>
  fetcher<ExperimentsPostSignature>({
    url: "/api/v2/experiments" as const,
    method: "POST" as const,
    body,
  }).then((exp) => useBoundStore.getState().updateExperiments([exp]));
