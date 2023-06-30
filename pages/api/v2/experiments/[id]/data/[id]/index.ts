import { DataEntryJson } from "../../../../../../../lib/common/types/models";

export const ENDPOINT = "/api/v2/experiments/[id]/data/[id]";

export type GetExperimentsIdDataId = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: DataEntryJson;
};
