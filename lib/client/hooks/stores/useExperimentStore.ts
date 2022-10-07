import create from "zustand";

import { ExperimentJson } from "../../../common/models/types";

interface ExperimentState {
  experiments: Record<string, ExperimentJson>;
  updateExperiment: (id: string, dir: ExperimentJson) => void;
  deleteExperiment: (id: string) => void;
}

export const useExperimentStore = create<ExperimentState>((set) => ({
  experiments: {},
  updateExperiment: (id, dir) =>
    set((state) => ({ experiments: { ...state.experiments, [id]: dir } })),
  deleteExperiment: (id) =>
    set((state) => {
      const { [id]: _, ...keep } = state.experiments;
      return { experiments: keep };
    }),
}));
