import { StateCreator } from "zustand";
import { CounterbalancesPostSignature } from "../../../../pages/api/v2/counterbalances";
import {
  CounterbalancesExpIdGetSignature,
  CounterbalancesExpIdPutSignature,
} from "../../../../pages/api/v2/counterbalances/[expId]";
import { ExperimentsPostSignature } from "../../../../pages/api/v2/experiments";
import {
  ExperimentsIdDeleteSignature,
  ExperimentsIdPutSignature,
} from "../../../../pages/api/v2/experiments/[id]";
import { ExperimentsIdMetaGetSignature } from "../../../../pages/api/v2/experiments/[id]/meta";
import { MetadataJson } from "../../../common/types/misc";

import {
  CounterbalanceJson,
  ExperimentJson,
} from "../../../common/types/models";
import { fetcher } from "../../fetcher";

export type ExperimentSlice = {
  experimentMap: Record<string, ExperimentJson>;
  updateExperiment: (
    id: string,
    update: ExperimentsIdPutSignature["body"]
  ) => Promise<void>;
  deleteExperiment: (id: string) => Promise<void>;
  createExperiment: (body: ExperimentsPostSignature["body"]) => Promise<void>;
  metadataMap: Record<string, MetadataJson>;
  getExperimentMeta: (id: string) => Promise<void>;
  counterbalanceMap: Record<string, CounterbalanceJson>;
  getCounterbalance: (expId: string) => Promise<void>;
  createCounterbalance: (
    body: CounterbalancesPostSignature["body"]
  ) => Promise<CounterbalanceJson>;
  updateCounterbalance: (
    expId: string,
    body: CounterbalancesExpIdPutSignature["body"]
  ) => Promise<CounterbalanceJson>;
};

export const createExperimentSlice: StateCreator<ExperimentSlice> = (
  set,
  get
) => ({
  experimentMap: {},
  updateExperiment: async (id, update) => {
    const original = get().experimentMap[id];
    const optimistic = { ...original, update };

    set((state) => ({
      experimentMap: {
        ...state.experimentMap,
        [id]: optimistic,
      },
    }));

    try {
      const exp = await fetcher<ExperimentsIdPutSignature>({
        url: "/api/v2/experiments/[id]" as const,
        method: "PUT" as const,
        query: { id },
        body: update,
      });
      set((state) => ({
        experimentMap: {
          ...state.experimentMap,
          [id]: exp,
        },
      }));
    } catch {
      set((state) => ({
        experimentMap: {
          ...state.experimentMap,
          [id]: original,
        },
      }));
    }
  },
  createExperiment: async (body) => {
    const exp = await fetcher<ExperimentsPostSignature>({
      url: "/api/v2/experiments" as const,
      method: "POST" as const,
      body,
    });
    set((state) => {
      return { experimentMap: { ...state.experimentMap, [exp._id]: exp } };
    });
  },
  deleteExperiment: async (id) => {
    const { [id]: original, ...rest } = get().experimentMap;

    set({ experimentMap: rest });

    try {
      await fetcher<ExperimentsIdDeleteSignature>({
        url: "/api/v2/experiments/[id]" as const,
        method: "DELETE" as const,
        query: { id },
      });
    } catch {
      set((state) => {
        return { experimentMap: { ...state.experimentMap, original } };
      });
    }
  },
  metadataMap: {},
  getExperimentMeta: async (id) => {
    const meta = await fetcher<ExperimentsIdMetaGetSignature>({
      url: "/api/v2/experiments/[id]/meta" as const,
      method: "GET" as const,
      query: { id },
    });
    set((state) => ({
      metadataMap: { ...state.metadataMap, [id]: meta },
    }));
  },
  counterbalanceMap: {},
  getCounterbalance: async (expId) => {
    try {
      const cb = await fetcher<CounterbalancesExpIdGetSignature>({
        url: "/api/v2/counterbalances/[id]" as const,
        method: "GET" as const,
        query: { id: expId },
      });
      set((state) => ({
        counterbalanceMap: { ...state.counterbalanceMap, [expId]: cb },
      }));
    } catch (e: any) {
      if (e.status !== 404 || get().counterbalanceMap[expId] == null) {
        return;
      }

      set((state) => {
        const { [expId]: _, ...rest } = state.counterbalanceMap;
        return {
          counterbalanceMap: rest,
        };
      });
    }
  },
  createCounterbalance: async (body) => {
    const cb = await fetcher<CounterbalancesPostSignature>({
      body,
      url: "/api/v2/counterbalances",
      method: "POST",
    });

    set((state) => ({
      counterbalanceMap: { ...state.counterbalanceMap, [cb.experiment]: cb },
    }));

    return cb;
  },
  updateCounterbalance: async (expId, body) => {
    const cb = await fetcher<CounterbalancesExpIdPutSignature>({
      url: "/api/v2/counterbalances/[id]",
      method: "PUT",
      query: {
        id: expId,
      },
      body,
    });

    set((state) => ({
      counterbalanceMap: { ...state.counterbalanceMap, [cb.experiment]: cb },
    }));

    return cb;
  },
});
