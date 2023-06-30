import { create } from "zustand";
import { createDataSlice, DataSlice } from "./dataSlice";

import { createDirectorySlice, DirectorySlice } from "./directorySlice";
import { createExperimentSlice, ExperimentSlice } from "./experimentSlice";
import { createUserSlice, UserSlice } from "./userSlice";

type StoreState = ExperimentSlice & DirectorySlice & UserSlice & DataSlice;

export const useBoundStore = create<StoreState>()((...args) => ({
  ...createExperimentSlice(...args),
  ...createDirectorySlice(...args),
  ...createUserSlice(...args),
  ...createDataSlice(...args),
}));
