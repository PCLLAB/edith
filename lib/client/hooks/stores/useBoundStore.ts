import create from "zustand";

import { createDirectorySlice, DirectorySlice } from "./directorySlice";
import { createExperimentSlice, ExperimentSlice } from "./experimentSlice";

type StoreState = ExperimentSlice & DirectorySlice;

export const useBoundStore = create<StoreState>()((...a) => ({
  ...createExperimentSlice(...a),
  ...createDirectorySlice(...a),
}));
