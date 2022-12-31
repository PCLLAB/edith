import { StateCreator } from "zustand";
import { ExperimentsIdMetaGetSignature } from "../../../../pages/api/v2/experiments/[id]/meta";
import { ExperimentMeta } from "../../../common/types/misc";

import { ExperimentJson } from "../../../common/types/models";
import { fetcher } from "../../fetcher";

export type ExperimentSlice = {
  experiment: Record<string, ExperimentJson>;
  updateExperiments: (updates: ExperimentJson[]) => void;
  deleteExperiments: (ids: string[]) => void;
  experimentMeta: Record<string, ExperimentMeta>;
  // updateExperimentMeta: (id: string, update: ExperimentMeta) => void;
  getExperimentMeta: (id: string) => ExperimentMeta | undefined;
};

export const createExperimentSlice: StateCreator<ExperimentSlice> = (
  set,
  get
) => ({
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
  // updateExperimentMeta: (id, update) =>
  // {

  //   const original = get().experimentMeta[id]

  //   set((state) => ({
  //     experimentMeta: { ...state.experimentMeta, [id]: update },
  //   }));

  // },
  getExperimentMeta: (id) => {
    console.log("getExpMeta running");
    const attempt = get().experimentMeta[id];
    if (attempt) return attempt;

    console.log("getExpMeta running FETCHING");
    fetcher<ExperimentsIdMetaGetSignature>({
      url: "/api/v2/experiments/[id]/meta" as const,
      method: "GET" as const,
      query: { id },
    }).then((update) => {
      console.log("getExpMeta THENNING", update);
      set((state) => ({
        experimentMeta: { ...state.experimentMeta, [id]: update },
        // .bind({}) is used to clone the function, forcing a rerender
        getExperimentMeta: state.getExperimentMeta.bind({}),
      }));
    });
  },
});
