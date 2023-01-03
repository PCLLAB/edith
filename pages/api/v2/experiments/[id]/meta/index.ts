import { DateTime } from "luxon";
import { MetadataJson } from "../../../../../../lib/common/types/misc";
import { getLocalDayISO } from "../../../../../../lib/common/utils";

import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../../lib/server/initHandler";
import { modelForCollection } from "../../../../../../models/DataEntry";
import Experiment from "../../../../../../models/Experiment";
import MongoDBData, {
  MongoDBDataJson,
} from "../../../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/experiments/[id]/meta";

export type ExperimentsIdMetaGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: MetadataJson;
};

const get: TypedApiHandlerWithAuth<ExperimentsIdMetaGetSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();
  const mongoDBData = await MongoDBData.findById(expObj.mongoDBData).lean();

  const DataModel = modelForCollection(mongoDBData.dataCollection);
  const dates = await DataModel.find().select("createdAt").lean();

  // TODO maybe don't hardcode this
  const userTimezone = "America/New_York";

  const activityLog: Record<string, number> = {};

  dates.forEach((doc) => {
    const localDateKey = getLocalDayISO(doc.createdAt, userTimezone);
    const count = activityLog[localDateKey] ?? 0;
    activityLog[localDateKey] = count + 1;
  });

  res.json({
    mongoDBData,
    activityLog,
  });
};

export default initHandler({
  GET: get,
});
