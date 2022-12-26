import { StateCreator } from "zustand";
import { ExperimentMeta } from "../../../common/types/misc";

import { ExperimentJson } from "../../../common/types/models";

export type ExperimentSlice = {
  experiment: Record<string, ExperimentJson>;
  updateExperiments: (updates: ExperimentJson[]) => void;
  deleteExperiments: (ids: string[]) => void;
  experimentMeta: Record<string, ExperimentMeta>;
  updateExperimentMeta: (id: string, update: ExperimentMeta) => void;
};

export const createExperimentSlice: StateCreator<ExperimentSlice> = (set) => ({
  experiment: {},
  updateExperiments: (updates) =>
    set((state) => ({
      experiment: {
        ...state.experiment,
        ...Object.fromEntries(updates.map((update) => [update._id, update])),
      },
    })),
  deleteExperiments: (ids) =>
    set((state) => {
      const mutableExpMap = state.experiment;
      ids.forEach((id) => delete mutableExpMap[id]);
      return { experiment: mutableExpMap };
    }),
  experimentMeta: {},
  updateExperimentMeta: (id, update) =>
    set((state) => ({
      experimentMeta: { ...state.experimentMeta, [id]: update },
    })),
});
