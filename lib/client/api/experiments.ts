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

export const updateExperiment = (
  id: string,
  update: ExperimentsIdPutSignature["body"]
) =>
  fetcher<ExperimentsIdPutSignature>({
    url: "/api/v2/experiments/[id]" as const,
    method: "PUT" as const,
    query: { id },
    body: update,
  }).then((exp) => useExperimentStore.getState().updateExperiments([exp]));

export const createExperiment = (body: ExperimentsPostSignature["body"]) =>
  fetcher<ExperimentsPostSignature>({
    url: "/api/v2/experiments" as const,
    method: "POST" as const,
    body,
  }).then((exp) => useExperimentStore.getState().updateExperiments([exp]));
