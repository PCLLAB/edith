import create from "zustand";

import { ExperimentJson } from "../../../common/models/types";

interface ExperimentState {
  experiments: Record<string, ExperimentJson>;
  updateExperiments: (updates: ExperimentJson[]) => void;
  deleteExperiments: (ids: string[]) => void;
}

export const useExperimentStore = create<ExperimentState>((set) => ({
  experiments: {},
  updateExperiments: (updates) =>
    set((state) => ({
      experiments: {
        ...state.experiments,
        ...Object.fromEntries(updates.map((update) => [update._id, update])),
      },
    })),
  deleteExperiments: (ids) =>
    set((state) => {
      const mutableExpMap = state.experiments;
      ids.forEach((id) => delete mutableExpMap[id]);
      return { experiments: mutableExpMap };
    }),
}));
