import { StateCreator } from "zustand";
import { GetExperimentsIdData } from "../../../../pages/api/v2/experiments/[id]/data";
import { DataEntryJson } from "../../../common/types/models";
import { fetcher } from "../../fetcher";

type DataEntryWrapper = {
  options: {
    skip?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  };
  entries: DataEntryJson[];
};

export type DataSlice = {
  dataMap: Record<string, DataEntryWrapper>;
  getData: (
    expId: string,
    options: {
      skip?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    }
  ) => Promise<DataEntryJson[]>;
};

export const createDataSlice: StateCreator<DataSlice> = (set, get) => ({
  dataMap: {},
  getData: async (expId, options) => {
    console.log("got opt", options);
    if (options.skip === 0) options.skip = undefined;
    if (options.limit === 0) options.limit = undefined;

    const existing = get().dataMap[expId];

    // TODO 10% case, we want a subset of data we already have
    // filter existing entries between start/endDate and fetch until limit

    // 90% case, we want to fetch all new entries, without options
    if (
      existing != null &&
      Object.values(existing.options).every((v) => v == null) &&
      Object.values(options).every((v) => v == null)
    ) {
      const newEntries = await fetcher<GetExperimentsIdData>({
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

    // clear existing data to avoid incorrect set
    // TODO solve 10% case to avoid deleting good data, see TODO above
    set((state) => {
      const { [expId]: _, ...rest } = state.dataMap;

      return { dataMap: rest };
    });

    const entries = await fetcher<GetExperimentsIdData>({
      url: "/api/v2/experiments/[id]/data",
      method: "GET",
      query: {
        id: expId,
        skip: options.skip,
        limit: options.limit,
        startDate: options.startDate,
        endDate: options.endDate,
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
