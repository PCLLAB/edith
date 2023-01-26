import { StateCreator } from "zustand";
import { ExperimentsIdDataGetSignature } from "../../../../pages/api/v2/experiments/[id]/data";
import { DataEntryJson } from "../../../common/types/models";
import { fetcher } from "../../fetcher";

type DataEntryWrapper = {
  options?: {
    skip?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  };
  entries: DataEntryJson[];
};

export type DataSlice = {
  dataMap: Record<string, DataEntryWrapper>;
  getData: (
    expId: string,
    options?: {
      skip?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ) => Promise<DataEntryJson[]>;
};

export const createDataSlice: StateCreator<DataSlice> = (set, get) => ({
  dataMap: {},
  getData: async (expId, options) => {
    const existing = get().dataMap[expId];

    // TODO 10% case, we want a subset of data we already have
    // filter existing entries between start/endDate and fetch until limit

    // 90% case, we want to fetch all new entries, without options
    if (existing != null && existing.options == null && options == null) {
      const newEntries = await fetcher<ExperimentsIdDataGetSignature>({
        url: "/api/v2/experiments/[id]/data",
        method: "GET",
        query: {
          id: expId,
          skip: existing.entries.length,
        },
      });

      if (newEntries.length === 0) return existing.entries;

      const entries = [...existing.entries, ...newEntries];

      set((state) => ({
        dataMap: {
          ...state.dataMap,
          [expId]: {
            options,
            entries,
          },
        },
      }));

      return entries;
    }

    const entries = await fetcher<ExperimentsIdDataGetSignature>({
      url: "/api/v2/experiments/[id]/data",
      method: "GET",
      query: {
        id: expId,
        skip: options?.skip,
        limit: options?.skip,
        startDate: options?.startDate?.toISOString(),
        endDate: options?.endDate?.toISOString(),
      },
    });

    set((state) => ({
      dataMap: {
        ...state.dataMap,
        [expId]: {
          options,
          entries,
        },
      },
    }));

    return entries;
  },
});
