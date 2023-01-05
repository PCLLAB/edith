import create from "zustand";

import { createDirectorySlice, DirectorySlice } from "./directorySlice";
import { createExperimentSlice, ExperimentSlice } from "./experimentSlice";
import { createUserSlice, UserSlice } from "./userSlice";

type StoreState = ExperimentSlice & DirectorySlice & UserSlice;

export const useBoundStore = create<StoreState>()((...args) => ({
  ...createExperimentSlice(...args),
  ...createDirectorySlice(...args),
  ...createUserSlice(...args),
}));
